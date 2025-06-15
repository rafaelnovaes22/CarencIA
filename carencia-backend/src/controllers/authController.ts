import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/database';
import {
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
    AuthRequest
} from '../middleware/auth';
import {
    validationError,
    unauthorizedError,
    conflictError,
    notFoundError
} from '../middleware/errorHandler';

// Registro de usuário
export const register = async (req: Request, res: Response) => {
    // Verificar validações
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw validationError('Dados de entrada inválidos');
    }

    const { email, password, fullName, userType, phone, interests } = req.body;

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw conflictError('Usuário já existe com este email');
    }

    // Hash da senha
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            fullName,
            userType,
            phone,
            interests: interests || [],
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            userType: true,
            phone: true,
            interests: true,
            createdAt: true,
        },
    });

    // Criar perfil específico baseado no tipo de usuário
    if (userType === 'BUYER') {
        await prisma.buyer.create({
            data: {
                userId: user.id,
            },
        });
    } else if (userType === 'DEALERSHIP') {
        // Para concessionárias, precisamos de dados adicionais
        // Por enquanto, criamos com dados básicos
        await prisma.dealership.create({
            data: {
                userId: user.id,
                companyName: fullName, // Temporário
                cnpj: '', // Será preenchido no onboarding
                address: '',
                city: '',
                state: '',
                brands: [],
            },
        });
    }

    // Gerar tokens
    const tokenPayload = {
        userId: user.id,
        email: user.email,
        userType: user.userType,
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Salvar refresh token no banco
    await prisma.userSession.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        },
    });

    res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        user,
        tokens: {
            accessToken,
            refreshToken,
        },
    });
};

// Login de usuário
export const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw validationError('Dados de entrada inválidos');
    }

    const { email, password } = req.body;

    // Buscar usuário
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            buyer: true,
            dealership: true,
        },
    });

    if (!user || !user.password) {
        throw unauthorizedError('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw unauthorizedError('Credenciais inválidas');
    }

    // Gerar tokens
    const tokenPayload = {
        userId: user.id,
        email: user.email,
        userType: user.userType,
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Salvar refresh token no banco
    await prisma.userSession.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        },
    });

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: userWithoutPassword,
        tokens: {
            accessToken,
            refreshToken,
        },
    });
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw unauthorizedError('Refresh token é obrigatório');
    }

    // Verificar se refresh token existe no banco
    const session = await prisma.userSession.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
        throw unauthorizedError('Refresh token inválido ou expirado');
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Gerar novo access token
    const tokenPayload = {
        userId: decoded.userId,
        email: decoded.email,
        userType: decoded.userType,
    };

    const newAccessToken = generateToken(tokenPayload);

    res.json({
        success: true,
        accessToken: newAccessToken,
    });
};

// Logout
export const logout = async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
        // Remover refresh token do banco
        await prisma.userSession.deleteMany({
            where: { token: refreshToken },
        });
    }

    res.json({
        success: true,
        message: 'Logout realizado com sucesso',
    });
};

// Esqueci minha senha
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    // Sempre retorna sucesso por segurança
    res.json({
        success: true,
        message: 'Se o email existir, você receberá instruções para redefinir sua senha',
    });

    // TODO: Implementar envio de email
    if (user) {
        console.log(`Reset password requested for user: ${user.email}`);
        // Aqui você implementaria o envio do email
    }
};

// Redefinir senha
export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    // TODO: Implementar verificação de token de reset
    // Por enquanto, retorna erro
    throw unauthorizedError('Funcionalidade de reset de senha ainda não implementada');
};

// Verificar email
export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.params;

    // TODO: Implementar verificação de email
    res.json({
        success: true,
        message: 'Email verificado com sucesso',
    });
};

// Reenviar verificação
export const resendVerification = async (req: Request, res: Response) => {
    const { email } = req.body;

    // TODO: Implementar reenvio de verificação
    res.json({
        success: true,
        message: 'Email de verificação reenviado',
    });
};

// OAuth Google
export const googleAuth = async (req: Request, res: Response) => {
    // TODO: Implementar OAuth Google
    res.redirect(`${process.env.FRONTEND_URL}/auth/google`);
};

export const googleCallback = async (req: Request, res: Response) => {
    // TODO: Implementar callback Google
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

// OAuth Facebook
export const facebookAuth = async (req: Request, res: Response) => {
    // TODO: Implementar OAuth Facebook
    res.redirect(`${process.env.FRONTEND_URL}/auth/facebook`);
};

export const facebookCallback = async (req: Request, res: Response) => {
    // TODO: Implementar callback Facebook
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
}; 