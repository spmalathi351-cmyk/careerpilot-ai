import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/navigation/Header';
import { Sidebar } from '../components/navigation/Sidebar';
import { DemoRoleBar } from '../components/common/DemoRoleBar';
import { useNotifications } from '../contexts/NotificationContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast, clearToast } = useNotifications();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* 1-Click Role Switcher Toolbar */}
      <DemoRoleBar />

      {/* Main Top Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Body with Sidebar & Content */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 max-w-md">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
            {(!toast.type || toast.type === 'info') && <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />}
            <p className="text-xs font-medium text-slate-200">{toast.message}</p>
            <button
              onClick={clearToast}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
