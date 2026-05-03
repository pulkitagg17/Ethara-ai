import { Router } from 'express';
import { authenticate } from '../../http/middleware/authenticate.js';
import { requireProjectAdmin, requireProjectMember } from '../../http/middleware/projectAccess.js';
import { validate } from '../../http/middleware/validate.js';
import { createTaskHandler, deleteTaskHandler, getTasksHandler, updateTaskHandler } from '../tasks/task.handlers.js';
import { createTaskSchema, updateTaskSchema } from '../tasks/task.schema.js';
import { addMemberHandler, createProjectHandler, getProjectHandler, getProjectsHandler } from './project.handlers.js';
import { addMemberSchema, createProjectSchema } from './project.schema.js';

export const projectRouter = Router();

projectRouter.use(authenticate);

projectRouter
    .route('/')
    .get(getProjectsHandler)
    .post(validate(createProjectSchema), createProjectHandler);

projectRouter
    .route('/:projectId')
    .get(requireProjectMember, getProjectHandler);

projectRouter
    .route('/:projectId/members')
    .post(requireProjectMember, requireProjectAdmin, validate(addMemberSchema), addMemberHandler);

projectRouter
    .route('/:projectId/tasks')
    .get(requireProjectMember, getTasksHandler)
    .post(requireProjectMember, requireProjectAdmin, validate(createTaskSchema), createTaskHandler);

projectRouter
    .route('/:projectId/tasks/:taskId')
    .patch(requireProjectMember, requireProjectAdmin, validate(updateTaskSchema), updateTaskHandler)
    .delete(requireProjectMember, requireProjectAdmin, deleteTaskHandler);
