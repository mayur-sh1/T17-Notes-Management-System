import { Response } from 'express';
import { GroupsService } from '../services/groups.service';
import { AuthRequest } from '../types';

export class GroupsController {
  static async createGroup(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Group name is required' });
      }

      const group = await GroupsService.createGroup(userId, name, description);

      res.status(201).json({
        message: 'Group created successfully',
        group,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create group' });
    }
  }

  static async getUserGroups(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const groups = await GroupsService.getUserGroups(userId);

      res.json({ groups });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'Failed to fetch groups',
      });
    }
  }

  static async getGroupById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const group = await GroupsService.getGroupById(id, userId);

      if (!group) {
        return res.status(404).json({ error: 'Group not found or access denied' });
      }

      res.json({ group });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch group' });
    }
  }

  static async addMember(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user!.id;
      const { id } = req.params;
      const { userId, role } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const member = await GroupsService.addMember(
        id,
        adminId,
        userId,
        role || 'MEMBER'
      );

      res.status(201).json({
        message: 'Member added successfully',
        member,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to add member' });
    }
  }

  static async removeMember(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user!.id;
      const { id, userId } = req.params;

      await GroupsService.removeMember(id, adminId, userId);

      res.json({ message: 'Member removed successfully' });
    } catch (error: any) {
      res.status(400).json({
        error: error.message || 'Failed to remove member',
      });
    }
  }

  static async updateGroup(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user!.id;
      const { id } = req.params;
      const { name, description } = req.body;

      const group = await GroupsService.updateGroup(id, adminId, {
        name,
        description,
      });

      res.json({
        message: 'Group updated successfully',
        group,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update group' });
    }
  }
}

