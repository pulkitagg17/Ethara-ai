import { z } from 'zod';

export const signupSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(6),
}).strict();

export const loginSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(1),
}).strict();

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
