import { Response } from 'express';
import { AdminService } from '../services/admin.service';
import { AuthRequest } from '../types';

export class AdminController {
  static async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const { page = '1', limit = '20' } = req.query;

      const result = await AdminService.getAllUsers(
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'Failed to fetch users',
      });
    }
  }

  static async updateUserRole(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || !['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Valid role is required' });
      }

      const user = await AdminService.updateUserRole(id, role);

      res.json({
        message: 'User role updated successfully',
        user,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message || 'Failed to update user role',
      });
    }
  }

  static async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await AdminService.deleteUser(id);

      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(400).json({
        error: error.message || 'Failed to delete user',
      });
    }
  }

  static async getSystemStats(req: AuthRequest, res: Response) {
    try {
      const stats = await AdminService.getSystemStats();

      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'Failed to fetch system stats',
      });
    }
  }

  static async getAllGroups(req: AuthRequest, res: Response) {
    try {
      const { page = '1', limit = '20' } = req.query;

      const result = await AdminService.getAllGroups(
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'Failed to fetch groups',
      });
    }
  }

  static async getUsageReports(req: AuthRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const reports = await AdminService.getUsageReports(start, end);

      res.json({ reports });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'Failed to fetch usage reports',
      });
    }
  }
}

