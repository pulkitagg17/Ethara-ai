import type { ProjectRole } from '@prisma/client';

export { };

declare global {
    namespace Express {
        interface Request {
            user?: { userId: string };
            projectRole?: ProjectRole;
        }
    }
}
