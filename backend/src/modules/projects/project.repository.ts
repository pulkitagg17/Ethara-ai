import type { ProjectRole } from '@prisma/client';
import type { DbClient } from '../../database/client.js';

export const createProjectRepository = (db: DbClient) => ({
    createOwnedProject: (ownerId: string, data: { name: string; description?: string }) =>
        db.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    name: data.name,
                    description: data.description,
                    ownerId,
                },
            });

            await tx.projectMember.create({
                data: {
                    projectId: project.id,
                    userId: ownerId,
                    role: 'ADMIN',
                },
            });

            return project;
        }),

    membership: (projectId: string, userId: string) =>
        db.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId } },
            select: { role: true },
        }),

    userProjects: (userId: string) =>
        db.project.findMany({
            where: { members: { some: { userId } } },
            include: {
                members: {
                    where: { userId },
                    select: { role: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        }),

    detailedProject: (projectId: string) =>
        db.project.findUnique({
            where: { id: projectId },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                    },
                    orderBy: { joinedAt: 'asc' },
                },
                tasks: {
                    select: { id: true, status: true },
                },
            },
        }),

    userByEmail: (email: string) =>
        db.user.findUnique({
            where: { email },
            select: { id: true },
        }),

    addMember: (projectId: string, userId: string, role: ProjectRole) =>
        db.projectMember.create({
            data: { projectId, userId, role },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        }),
});
