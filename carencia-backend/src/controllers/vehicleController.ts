import { Response } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/database';
import { AuthRequest } from '../middleware/auth';
import {
    validationError,
    notFoundError,
    forbiddenError
} from '../middleware/errorHandler';

// Listar veículos
export const getVehicles = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const { brand, minPrice, maxPrice, year, fuelType, transmission } = req.query;

    // Construir filtros
    const where: any = {
        status: 'DISPONIVEL',
    };

    if (brand) where.brand = { contains: brand as string, mode: 'insensitive' };
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice as string) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
    if (year) where.year = parseInt(year as string);
    if (fuelType) where.fuelType = fuelType;
    if (transmission) where.transmission = transmission;

    const [vehicles, total] = await Promise.all([
        prisma.vehicle.findMany({
            where,
            include: {
                dealership: {
                    select: {
                        companyName: true,
                        city: true,
                        state: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.vehicle.count({ where }),
    ]);

    res.json({
        success: true,
        vehicles,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
};

// Obter veículo específico
export const getVehicle = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
            dealership: {
                select: {
                    companyName: true,
                    address: true,
                    city: true,
                    state: true,
                    user: {
                        select: {
                            phone: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    if (!vehicle) {
        throw notFoundError('Veículo');
    }

    res.json({
        success: true,
        vehicle,
    });
};

// Criar veículo (apenas concessionárias)
export const createVehicle = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw validationError('Dados de entrada inválidos');
    }

    const userId = req.user!.id;

    // Buscar concessionária do usuário
    const dealership = await prisma.dealership.findUnique({
        where: { userId },
    });

    if (!dealership) {
        throw notFoundError('Concessionária');
    }

    const {
        brand,
        model,
        year,
        price,
        kilometers,
        color,
        transmission,
        fuelType,
        features,
        images,
        description,
    } = req.body;

    const vehicle = await prisma.vehicle.create({
        data: {
            dealershipId: dealership.id,
            brand,
            model,
            year,
            price,
            kilometers,
            color,
            transmission,
            fuelType,
            features: features || [],
            images: images || [],
            description,
        },
        include: {
            dealership: {
                select: {
                    companyName: true,
                    city: true,
                    state: true,
                },
            },
        },
    });

    res.status(201).json({
        success: true,
        message: 'Veículo criado com sucesso',
        vehicle,
    });
};

// Atualizar veículo
export const updateVehicle = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verificar se o veículo pertence à concessionária do usuário
    const vehicle = await prisma.vehicle.findFirst({
        where: {
            id,
            dealership: {
                userId,
            },
        },
    });

    if (!vehicle) {
        throw notFoundError('Veículo');
    }

    const updateData = { ...req.body };
    delete updateData.dealershipId; // Não permitir mudança de concessionária

    const updatedVehicle = await prisma.vehicle.update({
        where: { id },
        data: updateData,
        include: {
            dealership: {
                select: {
                    companyName: true,
                    city: true,
                    state: true,
                },
            },
        },
    });

    res.json({
        success: true,
        message: 'Veículo atualizado com sucesso',
        vehicle: updatedVehicle,
    });
};

// Deletar veículo
export const deleteVehicle = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verificar se o veículo pertence à concessionária do usuário
    const vehicle = await prisma.vehicle.findFirst({
        where: {
            id,
            dealership: {
                userId,
            },
        },
    });

    if (!vehicle) {
        throw notFoundError('Veículo');
    }

    await prisma.vehicle.delete({
        where: { id },
    });

    res.json({
        success: true,
        message: 'Veículo deletado com sucesso',
    });
};

// Buscar veículos
export const searchVehicles = async (req: AuthRequest, res: Response) => {
    const { q, ...filters } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = {
        status: 'DISPONIVEL',
    };

    // Busca textual
    if (q) {
        where.OR = [
            { brand: { contains: q as string, mode: 'insensitive' } },
            { model: { contains: q as string, mode: 'insensitive' } },
            { description: { contains: q as string, mode: 'insensitive' } },
        ];
    }

    // Aplicar outros filtros
    Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'page' && key !== 'limit') {
            if (key === 'minPrice') {
                where.price = { ...where.price, gte: parseFloat(value as string) };
            } else if (key === 'maxPrice') {
                where.price = { ...where.price, lte: parseFloat(value as string) };
            } else if (key === 'year') {
                where.year = parseInt(value as string);
            } else {
                where[key] = value;
            }
        }
    });

    const [vehicles, total] = await Promise.all([
        prisma.vehicle.findMany({
            where,
            include: {
                dealership: {
                    select: {
                        companyName: true,
                        city: true,
                        state: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.vehicle.count({ where }),
    ]);

    res.json({
        success: true,
        vehicles,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
        query: q,
    });
}; 