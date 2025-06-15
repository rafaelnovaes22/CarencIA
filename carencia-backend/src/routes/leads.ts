import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Placeholder controllers
const getLeads = async (req: any, res: any) => {
    res.json({ success: true, leads: [], message: 'Leads em desenvolvimento' });
};

const getLead = async (req: any, res: any) => {
    res.json({ success: true, lead: null, message: 'Lead em desenvolvimento' });
};

// Rotas protegidas
router.use(authenticateToken);

router.get('/', asyncHandler(getLeads));
router.get('/:id', asyncHandler(getLead));

export default router; 