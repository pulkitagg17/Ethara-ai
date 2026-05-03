import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { projectRouter } from './modules/projects/project.routes.js';
import { taskRouter } from './modules/tasks/task.routes.js';

import { requestLogger } from './http/middleware/requestLogger.js';
import { errorHandler } from './shared/errors.js';

const app = express();

app.use(cors({
    origin: env.frontendUrl,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get('/health', (_, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

app.use(errorHandler);

export default app;
