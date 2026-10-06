import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from './authRoutes.js';

const router = Router();

// Apply auth to all notification routes
router.use(requireAuth);

// Get Notifications
router.get('/', (req: Request, res: Response) => {
  const user = (req as any).user;
  const notifications = db.getNotificationsByUserId(user.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return res.json({ notifications, unreadCount });
});

// Mark Single as Read
router.patch('/:id/read', (req: Request, res: Response) => {
  const user = (req as any).user;
  const notif = db.getNotificationById(req.params.id);
  if (!notif) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  if (notif.userId !== user.id) {
    return res.status(403).json({ error: 'Forbidden: Access denied to notification' });
  }

  const success = db.markNotificationAsRead(req.params.id);
  return res.json({ success });
});

// Mark All as Read
router.patch('/read-all', (req: Request, res: Response) => {
  const user = (req as any).user;
  const success = db.markAllNotificationsAsRead(user.id);
  return res.json({ success });
});

export default router;
