import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { getAuthenticatedUserId } from './authRoutes.js';

const router = Router();

// Get Notifications
router.get('/', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const notifications = db.getNotificationsByUserId(userId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return res.json({ notifications, unreadCount });
});

// Mark Single as Read
router.patch('/:id/read', (req: Request, res: Response) => {
  const success = db.markNotificationAsRead(req.params.id);
  return res.json({ success });
});

// Mark All as Read
router.patch('/read-all', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const success = db.markAllNotificationsAsRead(userId);
  return res.json({ success });
});

export default router;
