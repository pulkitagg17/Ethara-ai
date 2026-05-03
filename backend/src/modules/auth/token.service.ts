import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export type AuthUser = {
    userId: string;
};

const cookieOptions = {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' as const : 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const issueToken = (payload: AuthUser) =>
    jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });

export const readToken = (token: string) =>
    jwt.verify(token, env.jwtSecret) as AuthUser;

export const attachAuthCookie = (res: Response, token: string) => {
    res.cookie('token', token, cookieOptions);
};

export const removeAuthCookie = (res: Response) => {
    res.clearCookie('token', {
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
    });
};
