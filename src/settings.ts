export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_USER = process.env.DB_USER;

const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_USER'];

for (const envVar of requiredEnvVars) {
  if (process.env[envVar] === undefined) {
    throw new Error(`Environment variable ${envVar} is not set.`);
  }
}
