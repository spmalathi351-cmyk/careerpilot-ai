import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md border border-slate-200/80 flex items-center justify-center animate-pulse">
            <img src="/careerpilot-mark.png" alt="CareerPilot AI" className="w-full h-full object-contain rounded-xl" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Authenticating CareerPilot AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/student/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === 'recruiter') {
      return <Navigate to="/recruiter/dashboard" replace />;
    } else if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};
