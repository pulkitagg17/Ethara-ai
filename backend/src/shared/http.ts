import type { Request, Response } from 'express';
import { httpError } from './errors.js';

export const param = (req: Request, name: string): string => {
    const value = req.params[name];

    if (!value || Array.isArray(value)) {
        throw httpError.badRequest(`Missing route parameter: ${name}`);
    }

    return value;
};

export const created = (res: Response, body: unknown) => res.status(201).json(body);

export const noContent = (res: Response) => res.status(204).send();
