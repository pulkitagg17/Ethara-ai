import type { DbClient } from '../../database/client.js';

export const createAuthRepository = (db: DbClient) => ({
    byEmail: (email: string) =>
        db.user.findUnique({ where: { email } }),

    byId: (id: string) =>
        db.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true },
        }),

    create: (data: { name: string; email: string; passwordHash: string }) =>
        db.user.create({
            data,
            select: { id: true, name: true, email: true },
        }),
});
