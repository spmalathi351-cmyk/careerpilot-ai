import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import route modules
import authRoutes from './server/routes/authRoutes.js';
import studentRoutes from './server/routes/studentRoutes.js';
import resumeRoutes from './server/routes/resumeRoutes.js';
import atsRoutes from './server/routes/atsRoutes.js';
import careerRoutes from './server/routes/careerRoutes.js';
import applicationRoutes from './server/routes/applicationRoutes.js';
import interviewRoutes from './server/routes/interviewRoutes.js';
import recruiterRoutes from './server/routes/recruiterRoutes.js';
import jobRoutes from './server/routes/jobRoutes.js';
import notificationRoutes from './server/routes/notificationRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';
import chatRoutes from './server/routes/chatRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/student', studentRoutes);
  app.use('/api/resumes', resumeRoutes);
  app.use('/api/ats', atsRoutes);
  app.use('/api/career', careerRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/interviews', interviewRoutes);
  app.use('/api/recruiter', recruiterRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/chat', chatRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'CareerPilot AI',
      timestamp: new Date().toISOString(),
    });
  });

  // Global API error handler
  app.use('/api/*', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('API Error:', err);
    res.status(500).json({
      error: 'An internal server error occurred',
      message: err.message || 'Unknown error',
    });
  });

  // Development: Vite Middleware Mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static build from dist/
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CareerPilot AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
