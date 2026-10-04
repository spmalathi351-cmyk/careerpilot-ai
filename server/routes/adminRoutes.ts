import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

// Admin Dashboard Summary
router.get('/dashboard', (req: Request, res: Response) => {
  const stats = db.getAdminStats();
  const recentAudit = db.getAuditLogs().slice(0, 8);
  const recentAiLogs = db.getAiUsageLogs().slice(0, 8);

  return res.json({
    stats,
    recentAudit,
    recentAiLogs,
    systemMetrics: {
      cpuUsage: '14.2%',
      memoryUsage: '382 MB / 2048 MB',
      nodeVersion: process.version,
      activeConnections: 18,
      geminiModelStatus: 'gemini-3.8-flash (Active)',
      uptimeSeconds: Math.floor(process.uptime()),
    },
  });
});

// Telemetry Details
router.get('/telemetry', (req: Request, res: Response) => {
  return res.json({
    endpoints: [
      { path: '/api/resumes/upload', method: 'POST', calls: 342, avgLatencyMs: 412, errorRate: '0.0%' },
      { path: '/api/ats/analyze', method: 'POST', calls: 820, avgLatencyMs: 180, errorRate: '0.0%' },
      { path: '/api/career/guidance', method: 'GET', calls: 610, avgLatencyMs: 290, errorRate: '0.0%' },
      { path: '/api/interviews/mock/:id/answer', method: 'POST', calls: 490, avgLatencyMs: 310, errorRate: '0.0%' },
      { path: '/api/recruiter/candidates/search', method: 'POST', calls: 730, avgLatencyMs: 45, errorRate: '0.0%' },
    ],
    resourceTimeline: [
      { time: '00:00', latencyMs: 220, requests: 45 },
      { time: '04:00', latencyMs: 195, requests: 28 },
      { time: '08:00', latencyMs: 260, requests: 140 },
      { time: '12:00', latencyMs: 285, requests: 310 },
      { time: '16:00', latencyMs: 240, requests: 270 },
      { time: '20:00', latencyMs: 210, requests: 110 },
    ],
  });
});

// AI Usage Logs
router.get('/ai-usage', (req: Request, res: Response) => {
  const logs = db.getAiUsageLogs();
  return res.json({ logs });
});

// Audit Logs
router.get('/audit-logs', (req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  return res.json({ logs });
});

export default router;
