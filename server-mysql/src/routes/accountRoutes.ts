import { Router } from 'express';
import { getMe, updateProfile } from '../controllers/accountController';
import { auth } from '../middleware/auth';

const router = Router();
router.get('/me', auth, getMe);
router.patch('/profile', auth, updateProfile);
export default router;
