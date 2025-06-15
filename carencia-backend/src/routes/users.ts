import { Router } from 'express';
import { body, param } from 'express-validator';
import {
    getProfile,
    updateProfile,
    deleteAccount,
    getBuyerProfile,
    updateBuyerProfile,
    getDealershipProfile,
    updateDealershipProfile
} from '../controllers/userController';
import { authenticateToken, requireBuyer, requireDealership } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Validações
const updateProfileValidation = [
    body('fullName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome completo deve ter entre 2 e 100 caracteres'),
    body('phone')
        .optional()
        .isMobilePhone('pt-BR')
        .withMessage('Telefone deve ser um número válido'),
    body('interests')
        .optional()
        .isArray()
        .withMessage('Interesses devem ser um array'),
];

const updateBuyerValidation = [
    body('age')
        .optional()
        .isInt({ min: 18, max: 100 })
        .withMessage('Idade deve ser entre 18 e 100 anos'),
    body('budgetMin')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Orçamento mínimo deve ser um valor positivo'),
    body('budgetMax')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Orçamento máximo deve ser um valor positivo'),
    body('location')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Localização deve ter entre 2 e 100 caracteres'),
    body('familySize')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Tamanho da família deve ser entre 1 e 20'),
    body('preferredBrands')
        .optional()
        .isArray()
        .withMessage('Marcas preferidas devem ser um array'),
    body('financingNeeded')
        .optional()
        .isBoolean()
        .withMessage('Necessidade de financiamento deve ser verdadeiro ou falso'),
    body('urgencyLevel')
        .optional()
        .isIn(['IMEDIATAMENTE', 'TRES_MESES', 'SEIS_MESES', 'PESQUISANDO'])
        .withMessage('Nível de urgência inválido'),
];

const updateDealershipValidation = [
    body('companyName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome da empresa deve ter entre 2 e 100 caracteres'),
    body('cnpj')
        .optional()
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
        .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'),
    body('address')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Endereço deve ter entre 5 e 200 caracteres'),
    body('city')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Cidade deve ter entre 2 e 100 caracteres'),
    body('state')
        .optional()
        .trim()
        .isLength({ min: 2, max: 2 })
        .withMessage('Estado deve ter 2 caracteres'),
    body('zipCode')
        .optional()
        .matches(/^\d{5}-?\d{3}$/)
        .withMessage('CEP deve estar no formato XXXXX-XXX'),
    body('brands')
        .optional()
        .isArray()
        .withMessage('Marcas devem ser um array'),
];

// Rotas gerais de usuário
router.get('/profile', asyncHandler(getProfile));
router.put('/profile', updateProfileValidation, asyncHandler(updateProfile));
router.delete('/account', asyncHandler(deleteAccount));

// Rotas específicas para compradores
router.get('/buyer/profile', requireBuyer, asyncHandler(getBuyerProfile));
router.put('/buyer/profile', requireBuyer, updateBuyerValidation, asyncHandler(updateBuyerProfile));

// Rotas específicas para concessionárias
router.get('/dealership/profile', requireDealership, asyncHandler(getDealershipProfile));
router.put('/dealership/profile', requireDealership, updateDealershipValidation, asyncHandler(updateDealershipProfile));

export default router; 