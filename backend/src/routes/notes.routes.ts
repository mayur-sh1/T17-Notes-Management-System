import { Router } from 'express';
import { NotesController } from '../controllers/notes.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', NotesController.getNotes);
router.post('/', NotesController.createNote);
router.get('/:id', NotesController.getNoteById);
router.put('/:id', NotesController.updateNote);
router.delete('/:id', NotesController.deleteNote);
router.get('/:id/versions', NotesController.getVersionHistory);

export default router;

