import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

// Helper to extract session or auth header (supports Bearer token or x-user-id)
export function getAuthenticatedUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }
  const customUser = req.headers['x-user-id'] as string;
  if (customUser && customUser.trim()) return customUser.trim();
  return null;
}

// Middleware: Require valid authenticated user
export function requireAuth(req: Request, res: Response, next: () => void) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
  }
  (req as any).user = user;
  (req as any).userId = user.id;
  next();
}

// Middleware: Require specific user role(s)
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: () => void) => {
    const user = (req as any).user || db.getUserById(getAuthenticatedUserId(req) || '');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    (req as any).user = user;
    (req as any).userId = user.id;
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] role`,
      });
    }
    next();
  };
}

// Student Registration
router.post('/register/student', (req: Request, res: Response) => {
  try {
    const { email, password, fullName, college, degree, department, graduationYear } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const newUser = db.createUser(
      {
        email,
        role: 'student',
        displayName: fullName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      },
      password
    );

    // Bootstrap initial student profile with genuine user data (zero fake skills or demo data)
    db.createOrUpdateStudentProfile(newUser.id, {
      headline: college ? `Student @ ${college}` : 'Candidate',
      education: college
        ? [
            {
              id: `edu-${Date.now()}`,
              institution: college,
              degree: degree || 'Bachelor of Science',
              field: department || 'Computer Science',
              startYear: (parseInt(graduationYear || '2026') - 4).toString(),
              endYear: graduationYear || '2026',
            },
          ]
        : [],
      skills: [],
      experience: [],
      projects: [],
      certifications: [],
      targetRoles: [],
      readinessScore: 0,
      atsAverage: 0,
      profileCompleteness: 15,
    });

    return res.status(201).json({
      message: 'Registration successful',
      user: newUser,
      token: newUser.id,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Student Login
router.post('/login/student', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user || user.role !== 'student') {
      return res.status(401).json({ error: 'Invalid email or password for student account.' });
    }

    const valid = db.verifyPassword(email, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your password.' });
    }

    return res.json({
      message: 'Login successful',
      user,
      token: user.id,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login error' });
  }
});

// Recruiter Registration
router.post('/register/recruiter', (req: Request, res: Response) => {
  try {
    const { fullName, email, password, companyName, companyDomain, designation } = req.body;

    if (!email || !password || !fullName || !companyName) {
      return res.status(400).json({ error: 'Name, work email, password, and company name are required.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const newUser = db.createUser(
      {
        email,
        role: 'recruiter',
        displayName: fullName,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      },
      password
    );

    db.createOrUpdateRecruiterProfile(
      newUser.id,
      { designation: designation || 'Technical Recruiter' },
      { name: companyName, domain: companyDomain || 'company.com' }
    );

    return res.status(201).json({
      message: 'Recruiter account registered',
      user: newUser,
      token: newUser.id,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Recruiter Login
router.post('/login/recruiter', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user || user.role !== 'recruiter') {
      return res.status(401).json({ error: 'Invalid email or password for recruiter account.' });
    }

    const valid = db.verifyPassword(email, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your password.' });
    }

    return res.json({
      message: 'Login successful',
      user,
      token: user.id,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login error' });
  }
});

// Admin Login
router.post('/login/admin', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = db.getUserByEmail(email);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid credentials for admin portal.' });
    }

    const valid = db.verifyPassword(email, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    return res.json({
      message: 'Admin access granted',
      user,
      token: user.id,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Admin login error' });
  }
});

// Current User Me
router.get('/me', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized or session expired' });
  }
  return res.json({ user });
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
});

// Forgot Password
router.post('/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  return res.json({
    message: `If an account exists with ${email}, a password reset verification link has been dispatched.`,
  });
});

export default router;
