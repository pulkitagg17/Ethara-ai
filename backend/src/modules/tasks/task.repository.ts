import type { Prisma } from '@prisma/client';
import type { DbClient } from '../../database/client.js';
import type { CreateTaskInput, UpdateTaskInput } from './task.schema.js';

const taskAssigneeInclude = {
    assignee: { select: { id: true, name: true } },
} satisfies Prisma.TaskInclude;

export const createTaskRepository = (db: DbClient) => ({
    projectMember: (projectId: string, userId: string) =>
        db.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId } },
            select: { role: true },
        }),

    create: (projectId: string, createdById: string, data: CreateTaskInput) =>
        db.task.create({
            data: {
                title: data.title,
                description: data.description,
                projectId,
                assigneeId: data.assigneeId,
                createdById,
                priority: data.priority,
                dueDate: data.dueDate,
            },
            include: taskAssigneeInclude,
        }),

    findMany: (args: {
        where: Prisma.TaskWhereInput;
        orderBy: Prisma.TaskOrderByWithRelationInput[];
        includeProject?: boolean;
    }) =>
        db.task.findMany({
            where: args.where,
            orderBy: args.orderBy,
            include: {
                assignee: { select: { id: true, name: true } },
                ...(args.includeProject ? { project: { select: { id: true, name: true } } } : {}),
            },
        }),

    findScoped: (projectId: string, taskId: string) =>
        db.task.findFirst({
            where: { id: taskId, projectId },
            select: { id: true, status: true },
        }),

    findForStatusUpdate: (taskId: string) =>
        db.task.findUnique({
            where: { id: taskId },
            select: { id: true, assigneeId: true, projectId: true, status: true },
        }),

    update: (taskId: string, data: UpdateTaskInput) =>
        db.task.update({
            where: { id: taskId },
            data,
            include: taskAssigneeInclude,
        }),

    setStatus: (taskId: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') =>
        db.task.update({
            where: { id: taskId },
            data: { status },
            include: taskAssigneeInclude,
        }),

    delete: (taskId: string) =>
        db.task.delete({ where: { id: taskId } }),
});
