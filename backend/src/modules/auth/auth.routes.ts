import { Router } from 'express';
import { validate } from '../../http/middleware/validate.js';
import { authenticate } from '../../http/middleware/authenticate.js';
import { getMe, login, logout, signup } from './auth.handlers.js';
import { loginSchema, signupSchema } from './auth.schema.js';

export const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), signup);
authRouter.post('/login', validate(loginSchema), login);
authRouter.get('/me', authenticate, getMe);
authRouter.post('/logout', authenticate, logout);
