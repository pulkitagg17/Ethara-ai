import type { NextFunction, Request, Response } from 'express';
import { readToken } from '../../modules/auth/token.service.js';
import { httpError } from '../../shared/errors.js';

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.token;

    if (!token) {
        next(httpError.unauthorized());
        return;
    }

    try {
        req.user = readToken(token);
        next();
    } catch {
        next(httpError.unauthorized());
    }
};
