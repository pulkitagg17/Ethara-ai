import type { Request, Response } from 'express';
import { prisma } from '../../database/client.js';
import { route } from '../../shared/errors.js';
import { created, noContent, param } from '../../shared/http.js';
import { readSort, readStatusFilter } from './task.filters.js';
import { createTaskRepository } from './task.repository.js';
import { createTaskService } from './task.service.js';

const tasks = createTaskService(createTaskRepository(prisma));

export const createTaskHandler = route(async (req: Request, res: Response) => {
    const task = await tasks.create(param(req, 'projectId'), req.user!.userId, req.body);
    return created(res, task);
});

export const getTasksHandler = route(async (req: Request, res: Response) => {
    const rows = await tasks.listProjectTasks(
        param(req, 'projectId'),
        req.user!.userId,
        req.projectRole!,
        readStatusFilter(req.query.status),
        readSort(req.query.sort)
    );

    return res.json(rows);
});

export const getMyTasksHandler = route(async (req: Request, res: Response) => {
    const rows = await tasks.listAssignedTasks(
        req.user!.userId,
        readStatusFilter(req.query.status),
        readSort(req.query.sort)
    );

    return res.json(rows);
});

export const updateTaskHandler = route(async (req: Request, res: Response) => {
    const task = await tasks.updateDetails(param(req, 'projectId'), param(req, 'taskId'), req.body);
    return res.json(task);
});

export const updateTaskStatusHandler = route(async (req: Request, res: Response) => {
    const task = await tasks.advanceStatus(param(req, 'taskId'), req.user!.userId, req.body.status);
    return res.json(task);
});

export const deleteTaskHandler = route(async (req: Request, res: Response) => {
    await tasks.delete(param(req, 'projectId'), param(req, 'taskId'));
    return noContent(res);
});
