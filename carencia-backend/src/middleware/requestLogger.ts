import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Generate request ID
    const requestId = Math.random().toString(36).substr(2, 9);
    req.headers['x-request-id'] = requestId;

    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${req.ip} - ID: ${requestId}`);

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ID: ${requestId}`);
    });

    next();
}; 