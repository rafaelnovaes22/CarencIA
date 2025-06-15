import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/database';
import { unauthorizedError, forbiddenError } from './errorHandler';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        userType: 'BUYER' | 'DEALERSHIP';
        fullName: string;
    };
}

export interface JWTPayload {
    userId: string;
    email: string;
    userType: 'BUYER' | 'DEALERSHIP';
    iat?: number;
    exp?: number;
}

// Middleware para verificar token JWT
export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            throw unauthorizedError('Token de acesso requerido');
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não configurado');
        }

        // Verificar token
        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

        // Buscar usuário no banco
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                userType: true,
                fullName: true,
                emailVerified: true,
            },
        });

        if (!user) {
            throw unauthorizedError('Usuário não encontrado');
        }

        // Verificar se email foi verificado (opcional)
        // if (!user.emailVerified) {
        //   throw unauthorizedError('Email não verificado');
        // }

        // Adicionar usuário ao request
        req.user = {
            id: user.id,
            email: user.email,
            userType: user.userType,
            fullName: user.fullName,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(unauthorizedError('Token inválido'));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(unauthorizedError('Token expirado'));
        } else {
            next(error);
        }
    }
};

// Middleware para verificar se usuário é comprador
export const requireBuyer = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(unauthorizedError('Usuário não autenticado'));
    }

    if (req.user.userType !== 'BUYER') {
        return next(forbiddenError('Acesso restrito a compradores'));
    }

    next();
};

// Middleware para verificar se usuário é concessionária
export const requireDealership = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(unauthorizedError('Usuário não autenticado'));
    }

    if (req.user.userType !== 'DEALERSHIP') {
        return next(forbiddenError('Acesso restrito a concessionárias'));
    }

    next();
};

// Middleware para verificar se usuário é dono do recurso
export const requireOwnership = (resourceIdParam: string = 'id') => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(unauthorizedError('Usuário não autenticado'));
            }

            const resourceId = req.params[resourceIdParam];
            const userId = req.user.id;

            // Para usuários, verificar se é o próprio usuário
            if (resourceId === userId) {
                return next();
            }

            // Para outros recursos, verificar ownership específico
            // Isso pode ser expandido conforme necessário
            return next(forbiddenError('Acesso negado a este recurso'));
        } catch (error) {
            next(error);
        }
    };
};

// Middleware opcional - não falha se não houver token
export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return next(); // Continua sem usuário
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return next();
        }

        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                userType: true,
                fullName: true,
            },
        });

        if (user) {
            req.user = {
                id: user.id,
                email: user.email,
                userType: user.userType,
                fullName: user.fullName,
            };
        }

        next();
    } catch (error) {
        // Ignora erros de token em auth opcional
        next();
    }
};

// Função para gerar token JWT
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
        throw new Error('JWT_SECRET não configurado');
    }

    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
};

// Função para gerar refresh token
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

    if (!jwtRefreshSecret) {
        throw new Error('JWT_REFRESH_SECRET não configurado');
    }

    return jwt.sign(payload, jwtRefreshSecret, { expiresIn: jwtRefreshExpiresIn });
};

// Função para verificar refresh token
export const verifyRefreshToken = (token: string): JWTPayload => {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtRefreshSecret) {
        throw new Error('JWT_REFRESH_SECRET não configurado');
    }

    return jwt.verify(token, jwtRefreshSecret) as JWTPayload;
}; 