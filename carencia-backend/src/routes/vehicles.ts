import { Router } from 'express';
import { body, query } from 'express-validator';
import {
    getVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    searchVehicles
} from '../controllers/vehicleController';
import { authenticateToken, requireDealership, optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Validações
const createVehicleValidation = [
    body('brand').trim().notEmpty().withMessage('Marca é obrigatória'),
    body('model').trim().notEmpty().withMessage('Modelo é obrigatório'),
    body('year').isInt({ min: 1990, max: new Date().getFullYear() + 1 }).withMessage('Ano inválido'),
    body('price').isFloat({ min: 0 }).withMessage('Preço deve ser um valor positivo'),
    body('kilometers').isInt({ min: 0 }).withMessage('Quilometragem deve ser um valor positivo'),
    body('color').trim().notEmpty().withMessage('Cor é obrigatória'),
    body('transmission').isIn(['MANUAL', 'AUTOMATICO', 'CVT']).withMessage('Transmissão inválida'),
    body('fuelType').isIn(['GASOLINA', 'ETANOL', 'FLEX', 'DIESEL', 'ELETRICO', 'HIBRIDO']).withMessage('Tipo de combustível inválido'),
];

// Rotas públicas (com auth opcional)
router.get('/', optionalAuth, asyncHandler(getVehicles));
router.get('/search', optionalAuth, asyncHandler(searchVehicles));
router.get('/:id', optionalAuth, asyncHandler(getVehicle));

// Rotas protegidas para concessionárias
router.post('/', authenticateToken, requireDealership, createVehicleValidation, asyncHandler(createVehicle));
router.put('/:id', authenticateToken, requireDealership, asyncHandler(updateVehicle));
router.delete('/:id', authenticateToken, requireDealership, asyncHandler(deleteVehicle));

export default router; 