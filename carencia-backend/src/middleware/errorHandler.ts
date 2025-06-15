import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    error: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Erro interno do servidor';
    let details: any = undefined;

    // Log do erro
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });

    // Custom App Error
    if (error instanceof CustomError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // Prisma Errors
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                statusCode = 409;
                message = 'Dados duplicados. Este registro já existe.';
                details = { field: error.meta?.target };
                break;
            case 'P2025':
                statusCode = 404;
                message = 'Registro não encontrado.';
                break;
            case 'P2003':
                statusCode = 400;
                message = 'Violação de chave estrangeira.';
                break;
            case 'P2014':
                statusCode = 400;
                message = 'Dados inválidos fornecidos.';
                break;
            default:
                statusCode = 400;
                message = 'Erro de banco de dados.';
        }
    }
    // Prisma Validation Error
    else if (error instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Dados de entrada inválidos.';
    }
    // JWT Errors
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token inválido.';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expirado.';
    }
    // Validation Errors
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Dados de entrada inválidos.';
        details = error.message;
    }
    // Multer Errors (File Upload)
    else if (error.name === 'MulterError') {
        statusCode = 400;
        if (error.message.includes('File too large')) {
            message = 'Arquivo muito grande.';
        } else if (error.message.includes('Unexpected field')) {
            message = 'Campo de arquivo inesperado.';
        } else {
            message = 'Erro no upload do arquivo.';
        }
    }
    // Syntax Errors
    else if (error instanceof SyntaxError) {
        statusCode = 400;
        message = 'Formato de dados inválido.';
    }

    // Response
    const response: any = {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
    };

    // Adicionar detalhes em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        response.details = details;
        response.stack = error.stack;
    }

    // Adicionar request ID se disponível
    if (req.headers['x-request-id']) {
        response.requestId = req.headers['x-request-id'];
    }

    res.status(statusCode).json(response);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Create specific error types
export const createError = (message: string, statusCode: number = 500) => {
    return new CustomError(message, statusCode);
};

export const notFoundError = (resource: string = 'Recurso') => {
    return new CustomError(`${resource} não encontrado`, 404);
};

export const unauthorizedError = (message: string = 'Não autorizado') => {
    return new CustomError(message, 401);
};

export const forbiddenError = (message: string = 'Acesso negado') => {
    return new CustomError(message, 403);
};

export const validationError = (message: string = 'Dados inválidos') => {
    return new CustomError(message, 400);
};

export const conflictError = (message: string = 'Conflito de dados') => {
    return new CustomError(message, 409);
}; 