function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
}

export const DB_HOST = getRequiredEnv('DB_HOST');
export const DB_NAME = getRequiredEnv('DB_NAME');
export const DB_PASSWORD = getRequiredEnv('DB_PASSWORD');
export const DB_USER = getRequiredEnv('DB_USER');
