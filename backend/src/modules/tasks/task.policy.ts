import type { TaskStatus } from '@prisma/client';
import { httpError } from '../../shared/errors.js';

const transitions = new Map<TaskStatus, TaskStatus>([
    ['PENDING', 'IN_PROGRESS'],
    ['IN_PROGRESS', 'COMPLETED'],
]);

export const assertTaskCanMove = (current: TaskStatus, requested: TaskStatus) => {
    const next = transitions.get(current);

    if (!next) throw httpError.badRequest('Completed tasks cannot change status');

    if (requested !== next) {
        throw httpError.badRequest(`Task status can only move from ${current} to ${next}`);
    }
};

export const assertTaskMutable = (status: TaskStatus) => {
    if (status === 'COMPLETED') {
        throw httpError.badRequest('Completed tasks cannot be updated');
    }
};
