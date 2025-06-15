import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import vehicleRoutes from './routes/vehicles';
import matchRoutes from './routes/matches';
import leadRoutes from './routes/leads';
import socialDataRoutes from './routes/socialData';
import analyticsRoutes from './routes/analytics';
import uploadRoutes from './routes/upload';
import healthRoutes from './routes/health';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { requestLogger } from './middleware/requestLogger';

// Import database
import { connectDatabase } from './utils/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (important for Railway deployment)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: {
        error: 'Muitas requisições deste IP, tente novamente em alguns minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Custom request logger
app.use(requestLogger);

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint (before other routes)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: '1.0.0',
    });
});

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'CarencIA API - Plataforma Inteligente de Matching Automotivo',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/health',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/social-data', socialDataRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/health', healthRoutes);

// API Routes placeholder
app.get('/api', (req, res) => {
    res.json({
        message: 'CarencIA API v1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            vehicles: '/api/vehicles',
            matches: '/api/matches',
            leads: '/api/leads',
            analytics: '/api/analytics',
        },
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.originalUrl} não existe`,
        timestamp: new Date().toISOString(),
    });
});

// Error handling middleware (must be last)
app.use((error: any, req: any, res: any, next: any) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start server
async function startServer() {
    try {
        // Connect to database
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 CarencIA API rodando na porta ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API Base: http://localhost:${PORT}/api`);
            console.log(`🏠 Home: http://localhost:${PORT}/`);

            if (process.env.NODE_ENV === 'development') {
                console.log(`🔧 Prisma Studio: npx prisma studio`);
            }
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();

export default app; 