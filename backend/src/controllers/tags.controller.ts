import { Request, Response } from 'express';
import { TagsService } from '../services/tags.service';

export class TagsController {
  static async getAllTags(req: Request, res: Response) {
    try {
      const tags = await TagsService.getAllTags();
      res.json({ tags });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch tags' });
    }
  }

  static async createTag(req: Request, res: Response) {
    try {
      const { name, color } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Tag name is required' });
      }

      const tag = await TagsService.createTag(name, color);
      res.status(201).json({
        message: 'Tag created successfully',
        tag,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create tag' });
    }
  }

  static async getTagByName(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const tag = await TagsService.getTagByName(name);

      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      res.json({ tag });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch tag' });
    }
  }
}

