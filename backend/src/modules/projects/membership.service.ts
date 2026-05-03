import type { ProjectRole } from '@prisma/client';
import { prisma } from '../../database/client.js';
import { TtlCache } from '../../shared/cache.js';
import { httpError } from '../../shared/errors.js';
import { createProjectRepository } from './project.repository.js';

const membershipCache = new TtlCache<ProjectRole>(30_000);
const projects = createProjectRepository(prisma);

const cacheKey = (projectId: string, userId: string) => `${projectId}:${userId}`;

export const getProjectRole = async (projectId: string, userId: string) => {
    const key = cacheKey(projectId, userId);
    const cached = membershipCache.get(key);

    if (cached) return cached;

    const member = await projects.membership(projectId, userId);
    if (!member) throw httpError.forbidden('Access denied');

    return membershipCache.set(key, member.role);
};

export const forgetProjectRole = (projectId: string, userId: string) => {
    membershipCache.delete(cacheKey(projectId, userId));
};
