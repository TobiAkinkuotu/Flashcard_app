import { Router } from 'express';
import { getMe, updateAvatar, updateProfile } from '../controllers/accountController';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
router.get('/me', auth, getMe);
router.patch('/profile', auth, updateProfile);
router.post('/avatar', auth, upload.single('avatar'), updateAvatar);
export default router;
