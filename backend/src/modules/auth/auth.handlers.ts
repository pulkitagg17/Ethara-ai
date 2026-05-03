import type { Request, Response } from 'express';
import { prisma } from '../../database/client.js';
import { created } from '../../shared/http.js';
import { route } from '../../shared/errors.js';
import { attachAuthCookie, issueToken, removeAuthCookie } from './token.service.js';
import { createAuthRepository } from './auth.repository.js';
import { createAuthService } from './auth.service.js';

const auth = createAuthService(createAuthRepository(prisma));

const openSession = (res: Response, user: { id: string; name: string; email: string }) => {
    attachAuthCookie(res, issueToken({ userId: user.id }));
    return { user };
};

export const signup = route(async (req: Request, res: Response) => {
    const user = await auth.register(req.body);
    return created(res, openSession(res, user));
});

export const login = route(async (req: Request, res: Response) => {
    const user = await auth.login(req.body);
    return res.json(openSession(res, user));
});

export const getMe = route(async (req: Request, res: Response) => {
    const user = await auth.me(req.user!.userId);
    return res.json(user);
});

export const logout = route(async (_req: Request, res: Response) => {
    removeAuthCookie(res);
    return res.json({ message: 'Logged out' });
});
