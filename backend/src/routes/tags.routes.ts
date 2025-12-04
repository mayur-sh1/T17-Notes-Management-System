import { Router } from 'express';
import { TagsController } from '../controllers/tags.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', TagsController.getAllTags);
router.post('/', TagsController.createTag);
router.get('/:name', TagsController.getTagByName);

export default router;

