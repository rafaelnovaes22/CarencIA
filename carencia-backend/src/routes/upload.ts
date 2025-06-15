import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Placeholder controllers
const uploadFile = async (req: any, res: any) => {
    res.json({ success: true, message: 'Upload em desenvolvimento' });
};

// Rotas protegidas
router.use(authenticateToken);

router.post('/', asyncHandler(uploadFile));

export default router; 