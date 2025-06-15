import { Router } from 'express';
import { authenticateToken, requireBuyer } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Placeholder controllers
const getMatches = async (req: any, res: any) => {
    res.json({ success: true, matches: [], message: 'Matches em desenvolvimento' });
};

const getMatch = async (req: any, res: any) => {
    res.json({ success: true, match: null, message: 'Match em desenvolvimento' });
};

// Rotas protegidas para compradores
router.use(authenticateToken);
router.use(requireBuyer);

router.get('/', asyncHandler(getMatches));
router.get('/:id', asyncHandler(getMatch));

export default router; 