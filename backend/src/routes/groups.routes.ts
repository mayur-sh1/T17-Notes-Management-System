import { Router } from 'express';
import { GroupsController } from '../controllers/groups.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', GroupsController.getUserGroups);
router.post('/', GroupsController.createGroup);
router.get('/:id', GroupsController.getGroupById);
router.put('/:id', GroupsController.updateGroup);
router.post('/:id/members', GroupsController.addMember);
router.delete('/:id/members/:userId', GroupsController.removeMember);

export default router;

