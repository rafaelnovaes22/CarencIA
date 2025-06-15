import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Placeholder controllers
const getSocialData = async (req: any, res: any) => {
    res.json({ success: true, socialData: [], message: 'Dados sociais em desenvolvimento' });
};

const connectSocialAccount = async (req: any, res: any) => {
    res.json({ success: true, message: 'Conexão de conta social em desenvolvimento' });
};

// Rotas protegidas
router.use(authenticateToken);

router.get('/', asyncHandler(getSocialData));
router.post('/connect', asyncHandler(connectSocialAccount));

export default router; 