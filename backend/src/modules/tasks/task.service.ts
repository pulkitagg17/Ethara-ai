import type { Prisma, ProjectRole } from '@prisma/client';
import { httpError } from '../../shared/errors.js';
import type { CreateTaskInput, UpdateTaskInput } from './task.schema.js';
import type { createTaskRepository } from './task.repository.js';
import { applyStatus, byPriorityThenDate, orderTasks, type StatusFilter, type TaskSort } from './task.filters.js';
import { assertTaskCanMove, assertTaskMutable } from './task.policy.js';

type TaskRepository = ReturnType<typeof createTaskRepository>;

export const createTaskService = (tasks: TaskRepository) => {
    const assertAssigneeBelongsToProject = async (projectId: string, assigneeId?: string) => {
        if (!assigneeId) return;

        const membership = await tasks.projectMember(projectId, assigneeId);
        if (!membership) throw httpError.badRequest('Assignee not in project');
    };

    const visibleTaskWhere = (projectId: string, userId: string, role: ProjectRole): Prisma.TaskWhereInput =>
        role === 'ADMIN'
            ? { projectId }
            : { projectId, assigneeId: userId };

    return {
        create: async (projectId: string, userId: string, input: CreateTaskInput) => {
            await assertAssigneeBelongsToProject(projectId, input.assigneeId);
            return tasks.create(projectId, userId, input);
        },

        listProjectTasks: async (
            projectId: string,
            userId: string,
            role: ProjectRole,
            status?: StatusFilter,
            sort?: TaskSort
        ) => {
            const rows = await tasks.findMany({
                where: applyStatus(visibleTaskWhere(projectId, userId, role), status),
                orderBy: orderTasks(status, sort),
            });

            return sort === 'priority' ? byPriorityThenDate(rows) : rows;
        },

        listAssignedTasks: async (userId: string, status?: StatusFilter, sort?: TaskSort) => {
            const rows = await tasks.findMany({
                where: applyStatus({ assigneeId: userId }, status),
                orderBy: orderTasks(status, sort),
                includeProject: true,
            });

            return sort === 'priority' ? byPriorityThenDate(rows) : rows;
        },

        updateDetails: async (projectId: string, taskId: string, input: UpdateTaskInput) => {
            const task = await tasks.findScoped(projectId, taskId);
            if (!task) throw httpError.notFound('Task not found');

            assertTaskMutable(task.status);
            return tasks.update(taskId, input);
        },

        delete: async (projectId: string, taskId: string) => {
            const task = await tasks.findScoped(projectId, taskId);
            if (!task) throw httpError.notFound('Task not found');

            assertTaskMutable(task.status);
            await tasks.delete(taskId);
        },

        advanceStatus: async (taskId: string, userId: string, requestedStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
            const task = await tasks.findForStatusUpdate(taskId);
            if (!task) throw httpError.notFound('Task not found');

            assertTaskCanMove(task.status, requestedStatus);

            const membership = await tasks.projectMember(task.projectId, userId);
            if (!membership) throw httpError.forbidden('Not a project member');

            if (task.assigneeId !== userId) {
                throw httpError.forbidden('Only the assigned user can change task status');
            }

            return tasks.setStatus(taskId, requestedStatus);
        },
    };
};
