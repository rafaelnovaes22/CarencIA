import { Router } from 'express';
import { checkDatabaseHealth } from '../utils/database';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

const healthCheck = async (req: any, res: any) => {
    const dbHealth = await checkDatabaseHealth();

    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: '1.0.0',
        database: dbHealth,
        memory: process.memoryUsage(),
    });
};

router.get('/', asyncHandler(healthCheck));

export default router; 