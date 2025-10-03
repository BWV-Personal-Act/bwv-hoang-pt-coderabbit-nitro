import { drizzle } from 'drizzle-orm/postgres-js';
import { eventHandler } from 'h3';
import { StatusCodes } from 'http-status-codes';

import { type Drz } from '~/repository/_base';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '~/settings';

let db: Drz | undefined = undefined;

declare module 'h3' {
  interface H3EventContext {
    db: Drz;
  }
}

const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

export default eventHandler(async (event) => {
  if (!db) {
    try {
      db = drizzle(connectionString, { logger: true });
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      throw createError({
        statusCode: StatusCodes.SERVICE_UNAVAILABLE,
        statusMessage: 'Database connection failed',
      });
    }
  }

  event.context.db = db;
});
