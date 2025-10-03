import { drizzle } from 'drizzle-orm/postgres-js';
import { eventHandler } from 'h3';

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
    db = drizzle(connectionString, { logger: true });
  }

  event.context.db = db;
});
