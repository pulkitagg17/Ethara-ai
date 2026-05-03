import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    description: z.string().max(500).trim().optional(),
}).strict();

export const addMemberSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
}).strict();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
