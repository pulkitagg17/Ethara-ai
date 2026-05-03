import type { NextFunction, Request, Response } from 'express';
import { logger } from '../../shared/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now();

    res.on('finish', () => {
        logger.info('request.completed', {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - startedAt,
        });
    });

    next();
};
