import type { Prisma, TaskStatus } from '@prisma/client';
import { httpError } from '../../shared/errors.js';

type StatusFilter = TaskStatus | TaskStatus[];
type TaskSort = 'dueDate' | 'createdAt' | 'updatedAt' | 'priority';

const allowedStatuses = new Set<TaskStatus>(['PENDING', 'IN_PROGRESS', 'COMPLETED']);
const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export const readStatusFilter = (value: unknown): StatusFilter | undefined => {
    const raw = Array.isArray(value) ? value.join(',') : value;

    if (raw === undefined || raw === '') return undefined;
    if (typeof raw !== 'string') throw httpError.badRequest('Invalid task status filter');

    const statuses = raw
        .split(',')
        .map((status) => status.trim())
        .filter(Boolean);

    if (statuses.some((status) => !allowedStatuses.has(status as TaskStatus))) {
        throw httpError.badRequest('Invalid task status filter');
    }

    return statuses.length === 1
        ? statuses[0] as TaskStatus
        : statuses as TaskStatus[];
};

export const readSort = (value: unknown): TaskSort | undefined => {
    if (value === undefined || value === '') return undefined;
    if (typeof value !== 'string') throw httpError.badRequest('Invalid task sort');

    if (!['dueDate', 'createdAt', 'updatedAt', 'priority'].includes(value)) {
        throw httpError.badRequest('Invalid task sort');
    }

    return value as TaskSort;
};

export const applyStatus = (where: Prisma.TaskWhereInput, status?: StatusFilter) => {
    if (!status) return where;

    return {
        ...where,
        status: Array.isArray(status) ? { in: status } : status,
    };
};

export const orderTasks = (status?: StatusFilter, sort?: TaskSort): Prisma.TaskOrderByWithRelationInput[] => {
    if (sort === 'priority') {
        return [{ priority: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }];
    }

    if (sort) return [{ [sort]: 'desc' }];

    return status === 'COMPLETED'
        ? [{ updatedAt: 'desc' }]
        : [{ dueDate: 'asc' }, { createdAt: 'desc' }];
};

export const byPriorityThenDate = <T extends { priority: keyof typeof priorityRank; dueDate: Date | null; createdAt: Date }>(
    rows: T[]
) =>
    [...rows].sort((left, right) => {
        const priorityDelta = priorityRank[left.priority] - priorityRank[right.priority];
        if (priorityDelta !== 0) return priorityDelta;

        const leftDue = left.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const rightDue = right.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
        if (leftDue !== rightDue) return leftDue - rightDue;

        return right.createdAt.getTime() - left.createdAt.getTime();
    });

export type { StatusFilter, TaskSort };
