import type { Request, Response } from 'express';
import { prisma } from '../../database/client.js';
import { route } from '../../shared/errors.js';
import { created, param } from '../../shared/http.js';
import { createProjectRepository } from './project.repository.js';
import { createProjectService } from './project.service.js';

const projects = createProjectService(createProjectRepository(prisma));

export const createProjectHandler = route(async (req: Request, res: Response) => {
    const project = await projects.create(req.user!.userId, req.body);
    return created(res, project);
});

export const getProjectsHandler = route(async (req: Request, res: Response) => {
    const rows = await projects.listForUser(req.user!.userId);
    return res.json(rows);
});

export const getProjectHandler = route(async (req: Request, res: Response) => {
    const project = await projects.getDetails(param(req, 'projectId'), req.user!.userId);
    return res.json(project);
});

export const addMemberHandler = route(async (req: Request, res: Response) => {
    const member = await projects.addMember(param(req, 'projectId'), req.body);
    return created(res, member);
});
