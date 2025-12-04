import { Router } from 'express';
import { NotificationsController } from '../controllers/notifications.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', NotificationsController.getNotifications);
router.get('/unread-count', NotificationsController.getUnreadCount);
router.put('/:id/read', NotificationsController.markAsRead);
router.put('/read-all', NotificationsController.markAllAsRead);
router.delete('/:id', NotificationsController.deleteNotification);

export default router;

