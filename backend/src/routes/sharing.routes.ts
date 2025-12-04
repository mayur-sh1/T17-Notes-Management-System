import { Router } from 'express';
import { SharingController } from '../controllers/sharing.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/share', SharingController.shareNote);
router.get('/shared-with-me', SharingController.getSharedNotes);
router.put('/:id/permission', SharingController.updatePermission);
router.delete('/:id', SharingController.unshareNote);

export default router;

