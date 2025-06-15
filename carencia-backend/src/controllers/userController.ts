import { Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/database';
import { AuthRequest } from '../middleware/auth';
import {
    validationError,
    notFoundError,
    forbiddenError
} from '../middleware/errorHandler';

// Obter perfil do usuário
export const getProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            avatarUrl: true,
            interests: true,
            lifestyleCategory: true,
            userType: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw notFoundError('Usuário');
    }

    res.json({
        success: true,
        user,
    });
};

// Atualizar perfil do usuário
export const updateProfile = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw validationError('Dados de entrada inválidos');
    }

    const userId = req.user!.id;
    const { fullName, phone, interests, lifestyleCategory } = req.body;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(fullName && { fullName }),
            ...(phone && { phone }),
            ...(interests && { interests }),
            ...(lifestyleCategory && { lifestyleCategory }),
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            avatarUrl: true,
            interests: true,
            lifestyleCategory: true,
            userType: true,
            emailVerified: true,
            updatedAt: true,
        },
    });

    res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        user: updatedUser,
    });
};

// Deletar conta
export const deleteAccount = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    // Deletar usuário (cascade irá deletar dados relacionados)
    await prisma.user.delete({
        where: { id: userId },
    });

    res.json({
        success: true,
        message: 'Conta deletada com sucesso',
    });
};

// Obter perfil específico do comprador
export const getBuyerProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const buyer = await prisma.buyer.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    avatarUrl: true,
                    interests: true,
                    lifestyleCategory: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });

    if (!buyer) {
        throw notFoundError('Perfil de comprador');
    }

    res.json({
        success: true,
        buyer,
    });
};

// Atualizar perfil específico do comprador
export const updateBuyerProfile = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw validationError('Dados de entrada inválidos');
    }

    const userId = req.user!.id;
    const {
        age,
        budgetMin,
        budgetMax,
        location,
        familySize,
        preferredBrands,
        financingNeeded,
        urgencyLevel,
    } = req.body;

    // Verificar se budgetMax >= budgetMin
    if (budgetMin && budgetMax && budgetMax < budgetMin) {
        throw validationError('Orçamento máximo deve ser maior que o mínimo');
    }

    const updatedBuyer = await prisma.buyer.update({
        where: { userId },
        data: {
            ...(age && { age }),
            ...(budgetMin !== undefined && { budgetMin }),
            ...(budgetMax !== undefined && { budgetMax }),
            ...(location && { location }),
            ...(familySize && { familySize }),
            ...(preferredBrands && { preferredBrands }),
            ...(financingNeeded !== undefined && { financingNeeded }),
            ...(urgencyLevel && { urgencyLevel }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    avatarUrl: true,
                    interests: true,
                    lifestyleCategory: true,
                },
            },
        },
    });

    res.json({
        success: true,
        message: 'Perfil de comprador atualizado com sucesso',
        buyer: updatedBuyer,
    });
};

// Obter perfil específico da concessionária
export const getDealershipProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const dealership = await prisma.dealership.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    avatarUrl: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            vehicles: {
                select: {
                    id: true,
                    brand: true,
                    model: true,
                    year: true,
                    price: true,
                    status: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 10, // Últimos 10 veículos
            },
        },
    });

    if (!dealership) {
        throw notFoundError('Perfil de concessionária');
    }

    res.json({
        success: true,
        dealership,
    });
};

// Atualizar perfil específico da concessionária
export const updateDealershipProfile = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw validationError('Dados de entrada inválidos');
    }

    const userId = req.user!.id;
    const {
        companyName,
        cnpj,
        address,
        city,
        state,
        zipCode,
        brands,
    } = req.body;

    // Verificar se CNPJ já existe (se fornecido)
    if (cnpj) {
        const existingDealership = await prisma.dealership.findFirst({
            where: {
                cnpj,
                userId: { not: userId },
            },
        });

        if (existingDealership) {
            throw validationError('CNPJ já está em uso por outra concessionária');
        }
    }

    const updatedDealership = await prisma.dealership.update({
        where: { userId },
        data: {
            ...(companyName && { companyName }),
            ...(cnpj && { cnpj }),
            ...(address && { address }),
            ...(city && { city }),
            ...(state && { state }),
            ...(zipCode && { zipCode }),
            ...(brands && { brands }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    avatarUrl: true,
                },
            },
        },
    });

    res.json({
        success: true,
        message: 'Perfil de concessionária atualizado com sucesso',
        dealership: updatedDealership,
    });
}; 