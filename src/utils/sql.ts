import { sql } from 'drizzle-orm';

export const noRecordCondition = sql`null is not null`;
