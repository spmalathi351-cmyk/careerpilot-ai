import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  loginStudent: (email: string, pass: string) => Promise<void>;
  registerStudent: (data: any) => Promise<void>;
  loginRecruiter: (email: string, pass: string) => Promise<void>;
  registerRecruiter: (data: any) => Promise<void>;
  loginAdmin: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check existing session
    const token = api.getToken();
    if (token) {
      api
        .getCurrentUser()
        .then((res) => {
          setUser(res.user);
        })
        .catch(() => {
          // Token is invalid or expired: clear and keep unauthenticated
          api.clearToken();
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Clean visitor: remains unauthenticated
      setUser(null);
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  const loginStudent = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.loginStudent({ email, password: pass });
      api.setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerStudent = async (data: any) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.registerStudent(data);
      api.setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginRecruiter = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.loginRecruiter({ email, password: pass });
      api.setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Recruiter login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerRecruiter = async (data: any) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.registerRecruiter(data);
      api.setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Recruiter registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.loginAdmin({ email, password: pass });
      api.setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Admin login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Logout API cleanup notice:', e);
    } finally {
      api.clearToken();
      setUser(null);
    }
  };

  // Demo switch helper
  const switchDemoRole = async (targetRole: UserRole) => {
    setLoading(true);
    try {
      if (targetRole === 'student') {
        const res = await api.loginStudent({ email: 'student@careerpilot.ai', password: 'student123' });
        api.setToken(res.token);
        setUser(res.user);
      } else if (targetRole === 'recruiter') {
        const res = await api.loginRecruiter({ email: 'recruiter@careerpilot.ai', password: 'recruiter123' });
        api.setToken(res.token);
        setUser(res.user);
      } else if (targetRole === 'admin') {
        const res = await api.loginAdmin({ email: 'admin@careerpilot.ai', password: 'admin123' });
        api.setToken(res.token);
        setUser(res.user);
      }
    } catch (err) {
      console.warn('Switch role error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        error,
        clearError,
        loginStudent,
        registerStudent,
        loginRecruiter,
        registerRecruiter,
        loginAdmin,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
