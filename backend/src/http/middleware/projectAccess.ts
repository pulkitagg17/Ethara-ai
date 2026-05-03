import type { NextFunction, Request, Response } from 'express';
import { param } from '../../shared/http.js';
import { httpError } from '../../shared/errors.js';
import { getProjectRole } from '../../modules/projects/membership.service.js';

export const requireProjectMember = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        req.projectRole = await getProjectRole(param(req, 'projectId'), req.user!.userId);
        next();
    } catch (err) {
        next(err);
    }
};

export const requireProjectAdmin = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (req.projectRole !== 'ADMIN') {
        next(httpError.forbidden(req.projectRole ? 'Admin role required' : 'Project role is missing'));
        return;
    }

    next();
};
