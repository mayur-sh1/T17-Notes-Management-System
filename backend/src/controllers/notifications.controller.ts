import { Response } from 'express';
import { NotificationsService } from '../services/notifications.service';
import { AuthRequest } from '../types';

export class NotificationsController {
  static async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { limit = '50' } = req.query;

      const notifications = await NotificationsService.getUserNotifications(
        userId,
        parseInt(limit as string)
      );

      res.json({ notifications });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'Failed to fetch notifications',
      });
    }
  }

  static async getUnreadCount(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const count = await NotificationsService.getUnreadCount(userId);

      res.json({ count });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'Failed to fetch unread count',
      });
    }
  }

  static async markAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const notification = await NotificationsService.markAsRead(id, userId);

      res.json({
        message: 'Notification marked as read',
        notification,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message || 'Failed to mark notification as read',
      });
    }
  }

  static async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      await NotificationsService.markAllAsRead(userId);

      res.json({ message: 'All notifications marked as read' });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'Failed to mark all as read',
      });
    }
  }

  static async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await NotificationsService.deleteNotification(id, userId);

      res.json({ message: 'Notification deleted successfully' });
    } catch (error: any) {
      res.status(400).json({
        error: error.message || 'Failed to delete notification',
      });
    }
  }
}

