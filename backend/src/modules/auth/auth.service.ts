import bcrypt from 'bcryptjs';
import { httpError } from '../../shared/errors.js';
import type { LoginInput, SignupInput } from './auth.schema.js';
import type { createAuthRepository } from './auth.repository.js';

type AuthRepository = ReturnType<typeof createAuthRepository>;

export const createAuthService = (users: AuthRepository) => {
    const publicUser = (user: { id: string; name: string; email: string }) => ({
        id: user.id,
        name: user.name,
        email: user.email,
    });

    return {
        register: async (input: SignupInput) => {
            const existing = await users.byEmail(input.email);
            if (existing) throw httpError.conflict('Email already exists');

            const passwordHash = await bcrypt.hash(input.password, 12);
            const user = await users.create({
                name: input.name,
                email: input.email,
                passwordHash,
            });

            return publicUser(user);
        },

        login: async (input: LoginInput) => {
            const user = await users.byEmail(input.email);
            const passwordMatches = user
                ? await bcrypt.compare(input.password, user.passwordHash)
                : false;

            if (!user || !passwordMatches) {
                throw httpError.unauthorized('Invalid credentials');
            }

            return publicUser(user);
        },

        me: async (userId: string) => {
            const user = await users.byId(userId);
            if (!user) throw httpError.notFound('User not found');
            return publicUser(user);
        },
    };
};
