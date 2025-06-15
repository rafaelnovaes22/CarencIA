import { Router } from 'express';
import { body } from 'express-validator';
import {
    register,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    googleAuth,
    googleCallback,
    facebookAuth,
    facebookCallback
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Validações
const registerValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email válido é obrigatório'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Senha deve ter pelo menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
    body('fullName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome completo deve ter entre 2 e 100 caracteres'),
    body('userType')
        .isIn(['BUYER', 'DEALERSHIP'])
        .withMessage('Tipo de usuário deve ser BUYER ou DEALERSHIP'),
    body('phone')
        .optional()
        .isMobilePhone('pt-BR')
        .withMessage('Telefone deve ser um número válido'),
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email válido é obrigatório'),
    body('password')
        .notEmpty()
        .withMessage('Senha é obrigatória'),
];

const forgotPasswordValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email válido é obrigatório'),
];

const resetPasswordValidation = [
    body('token')
        .notEmpty()
        .withMessage('Token é obrigatório'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Senha deve ter pelo menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
];

// Rotas públicas
router.post('/register', registerValidation, asyncHandler(register));
router.post('/login', loginValidation, asyncHandler(login));
router.post('/refresh-token', asyncHandler(refreshToken));
router.post('/forgot-password', forgotPasswordValidation, asyncHandler(forgotPassword));
router.post('/reset-password', resetPasswordValidation, asyncHandler(resetPassword));
router.get('/verify-email/:token', asyncHandler(verifyEmail));
router.post('/resend-verification', asyncHandler(resendVerification));

// OAuth Routes
router.get('/google', asyncHandler(googleAuth));
router.get('/google/callback', asyncHandler(googleCallback));
router.get('/facebook', asyncHandler(facebookAuth));
router.get('/facebook/callback', asyncHandler(facebookCallback));

// Rotas protegidas
router.post('/logout', authenticateToken, asyncHandler(logout));

// Rota para verificar se token é válido
router.get('/me', authenticateToken, (req: any, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});

export default router; 