import { Response } from 'express';
import { NotesService } from '../services/notes.service';
import { AuthRequest } from '../types';

export class NotesController {
  static async createNote(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { title, content, isRichText, tagIds } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const note = await NotesService.createNote(
        userId,
        title,
        content,
        isRichText !== undefined ? isRichText : true,
        tagIds
      );

      res.status(201).json({
        message: 'Note created successfully',
        note,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create note' });
    }
  }

  static async getNotes(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const {
        search,
        tags,
        authorId,
        sharedOnly,
        page = '1',
        limit = '20',
      } = req.query;

      const tagIds = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;

      const result = await NotesService.getNotes(userId, {
        search: search as string,
        tagIds: tagIds as string[],
        authorId: authorId as string,
        sharedOnly: sharedOnly === 'true',
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch notes' });
    }
  }

  static async getNoteById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const note = await NotesService.getNoteById(id, userId);

      if (!note) {
        return res.status(404).json({ error: 'Note not found or access denied' });
      }

      res.json({ note });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch note' });
    }
  }

  static async updateNote(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { title, content, tagIds } = req.body;

      const note = await NotesService.updateNote(id, userId, {
        title,
        content,
        tagIds,
      });

      res.json({
        message: 'Note updated successfully',
        note,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update note' });
    }
  }

  static async deleteNote(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await NotesService.deleteNote(id, userId);

      res.json({ message: 'Note deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete note' });
    }
  }

  static async getVersionHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { limit = '20' } = req.query;

      const versions = await NotesService.getVersionHistory(
        id,
        userId,
        parseInt(limit as string)
      );

      res.json({ versions });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch version history' });
    }
  }
}

