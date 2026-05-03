import { Router } from 'express';
import { authenticate } from '../../http/middleware/authenticate.js';
import { validate } from '../../http/middleware/validate.js';
import { getMyTasksHandler, updateTaskStatusHandler } from './task.handlers.js';
import { updateTaskStatusSchema } from './task.schema.js';

export const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.get('/me', getMyTasksHandler);
taskRouter.patch('/:taskId/status', validate(updateTaskStatusSchema), updateTaskStatusHandler);
