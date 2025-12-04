import { Response } from 'express';
import { SharingService } from '../services/sharing.service';
import { AuthRequest } from '../types';

export class SharingController {
  static async shareNote(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { noteId, userId: shareUserId, groupId, permission } = req.body;

      if (!noteId || !permission) {
        return res.status(400).json({
          error: 'Note ID and permission are required',
        });
      }

      if (!shareUserId && !groupId) {
        return res.status(400).json({
          error: 'Either userId or groupId is required',
        });
      }

      const share = await SharingService.shareNote(noteId, userId, {
        userId: shareUserId,
        groupId,
        permission,
      });

      res.status(201).json({
        message: 'Note shared successfully',
        share,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to share note' });
    }
  }

  static async getSharedNotes(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const notes = await SharingService.getSharedNotes(userId);

      res.json({ notes });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'Failed to fetch shared notes',
      });
    }
  }

  static async updatePermission(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { permission } = req.body;

      if (!permission) {
        return res.status(400).json({ error: 'Permission is required' });
      }

      const share = await SharingService.updateSharePermission(
        id,
        userId,
        permission
      );

      res.json({
        message: 'Share permission updated successfully',
        share,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message || 'Failed to update permission',
      });
    }
  }

  static async unshareNote(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await SharingService.unshareNote(id, userId);

      res.json({ message: 'Note unshared successfully' });
    } catch (error: any) {
      res.status(400).json({
        error: error.message || 'Failed to unshare note',
      });
    }
  }
}

