import 'dotenv/config';

type RuntimeEnv = {
    nodeEnv: string;
    port: number;
    frontendUrl?: string;
    jwtSecret: string;
    isProduction: boolean;
};

const readPort = (value: string | undefined): number => {
    const parsed = Number(value ?? 5000);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 5000;
};

const resolveJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;

    if (secret) return secret;

    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be configured in production');
    }

    return 'development-only-secret';
};

export const env: RuntimeEnv = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: readPort(process.env.PORT),
    frontendUrl: process.env.FRONTEND_URL,
    jwtSecret: resolveJwtSecret(),
    isProduction: process.env.NODE_ENV === 'production',
};
