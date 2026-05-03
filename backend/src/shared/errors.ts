import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from './logger.js';

type ErrorCode =
    | 'BAD_REQUEST'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'VALIDATION_ERROR'
    | 'INTERNAL_ERROR';

export class HttpError extends Error {
    readonly statusCode: number;
    readonly code: ErrorCode;
    readonly details?: unknown;

    constructor(message: string, statusCode = 500, code: ErrorCode = 'INTERNAL_ERROR', details?: unknown) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const httpError = {
    badRequest: (message: string, details?: unknown) => new HttpError(message, 400, 'BAD_REQUEST', details),
    unauthorized: (message = 'Unauthorized') => new HttpError(message, 401, 'UNAUTHORIZED'),
    forbidden: (message = 'Forbidden') => new HttpError(message, 403, 'FORBIDDEN'),
    notFound: (message: string) => new HttpError(message, 404, 'NOT_FOUND'),
    conflict: (message: string) => new HttpError(message, 409, 'CONFLICT'),
    validation: (details: unknown) => new HttpError('Validation failed', 400, 'VALIDATION_ERROR', details),
};

export const route =
    (handler: RequestHandler): RequestHandler =>
        (req, res, next) =>
            Promise.resolve(handler(req, res, next)).catch(next);

const serializeZod = (error: ZodError) =>
    error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
    }));

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
            ...(err.details ? { details: err.details } : {}),
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: serializeZod(err),
        });
    }

    logger.error('Unhandled request failure', { path: req.path, method: req.method, err });

    return res.status(500).json({
        error: 'Internal Server Error',
        code: 'INTERNAL_ERROR',
    });
};
