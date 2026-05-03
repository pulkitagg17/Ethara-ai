import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';
import { httpError } from '../../shared/errors.js';

const formatIssues = (issues: z.core.$ZodIssue[]) =>
    issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
    }));

export const validate =
    (schema: z.ZodType) =>
        (req: Request, _res: Response, next: NextFunction) => {
            const parsed = schema.safeParse(req.body);

            if (!parsed.success) {
                next(httpError.validation(formatIssues(parsed.error.issues)));
                return;
            }

            req.body = parsed.data;
            next();
        };
