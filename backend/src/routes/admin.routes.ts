import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';

const router = Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/users', AdminController.getAllUsers);
router.put('/users/:id/role', AdminController.updateUserRole);
router.delete('/users/:id', AdminController.deleteUser);
router.get('/stats', AdminController.getSystemStats);
router.get('/groups', AdminController.getAllGroups);
router.get('/reports', AdminController.getUsageReports);

export default router;

