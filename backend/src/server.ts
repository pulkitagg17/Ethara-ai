import app from './app.js';
import { env } from './config/env.js';
import { logger } from './shared/logger.js';

app.listen(env.port, () => {
    logger.info('server.started', { port: env.port, environment: env.nodeEnv });
});
