import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { MetricCard } from '../../components/common/MetricCard';
import {
  Shield,
  Users,
  Briefcase,
  Activity,
  Cpu,
  Sparkles,
  Server,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'ai'>('overview');

  useEffect(() => {
    Promise.all([api.getAdminDashboard(), api.getAdminTelemetry()])
      .then(([dashRes, teleRes]) => {
        setData(dashRes);
        setTelemetry(teleRes);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading admin telemetry console...</div>;
  }

  const stats = data?.stats || {
    totalUsers: 5,
    studentCount: 3,
    recruiterCount: 1,
    activeJobs: 3,
    totalApplications: 6,
    completedInterviews: 2,
    totalAiRequests: 1420,
    totalAiTokens: 384000,
    systemHealth: '100% Operational',
    uptime: '99.98%',
    avgAiLatencyMs: 245,
  };

  const sys = data?.systemMetrics || {
    cpuUsage: '14.2%',
    memoryUsage: '382 MB / 2048 MB',
    nodeVersion: 'v20.x',
    activeConnections: 18,
    geminiModelStatus: 'gemini-3.8-flash (Active)',
  };

  const auditLogs = data?.recentAudit || [];
  const aiLogs = data?.recentAiLogs || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Healthy · {sys.geminiModelStatus}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Platform Telemetry &amp; Admin Console</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time monitoring across user accounts, AI token budgets, API latency, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Uptime: <span className="font-bold text-white">{stats.uptime}</span></span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-400">Avg Latency: <span className="font-bold text-emerald-400">{stats.avgAiLatencyMs}ms</span></span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Registered Accounts"
          value={stats.totalUsers}
          subtitle={`${stats.studentCount} Students · ${stats.recruiterCount} Recruiters`}
          icon={Users}
          accentColor="indigo"
        />
        <MetricCard
          title="Active Jobs &amp; Pipeline"
          value={stats.activeJobs}
          subtitle={`${stats.totalApplications} total applications`}
          icon={Briefcase}
          accentColor="emerald"
        />
        <MetricCard
          title="AI Evaluation Requests"
          value={stats.totalAiRequests.toLocaleString()}
          subtitle={`${(stats.totalAiTokens / 1000).toFixed(0)}k total tokens used`}
          icon={Sparkles}
          accentColor="violet"
        />
        <MetricCard
          title="System Memory / Node"
          value={sys.memoryUsage.split('/')[0].trim()}
          subtitle={`Node ${sys.nodeVersion} · CPU ${sys.cpuUsage}`}
          icon={Server}
          accentColor="blue"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Endpoint Telemetry
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Platform Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Gemini AI Logs ({aiLogs.length})
        </button>
      </div>

      {/* Tab 1: Endpoint Telemetry */}
      {activeTab === 'overview' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            API Endpoints Performance Telemetry
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Endpoint</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Calls (24h)</th>
                  <th className="py-3 px-4">Average Latency</th>
                  <th className="py-3 px-4">Error Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {(telemetry?.endpoints || []).map((ep: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{ep.path}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700">
                        {ep.method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{ep.calls}</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-bold">{ep.avgLatencyMs}ms</td>
                    <td className="py-3.5 px-4 text-slate-500">{ep.errorRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Security &amp; Operational Audit Trail
          </h2>

          <div className="divide-y divide-slate-100 font-mono text-xs">
            {auditLogs.map((log: any) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {log.action}
                  </span>
                  <span className="text-slate-800 font-sans font-semibold">{log.userName} ({log.role})</span>
                  <span className="text-slate-400 text-[11px]">IP: {log.ipAddress}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: AI Logs */}
      {activeTab === 'ai' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Gemini 3.8 Flash Request &amp; Token Consumption Log
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Feature Workflow</th>
                  <th className="py-3 px-4">Engine Model</th>
                  <th className="py-3 px-4">Input Tokens</th>
                  <th className="py-3 px-4">Output Tokens</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {aiLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">{log.feature}</td>
                    <td className="py-3 px-4 text-indigo-600 font-semibold">{log.model}</td>
                    <td className="py-3 px-4 text-slate-600">{log.inputTokens}</td>
                    <td className="py-3 px-4 text-slate-600">{log.outputTokens}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-right">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
