import { bigint, bigserial, date, integer, pgTable, smallint, timestamp, varchar } from "drizzle-orm/pg-core";

const refOpt = { onDelete: 'restrict' as const, onUpdate: 'restrict' as const };

const commonFields = () => ({
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const customers = pgTable('customers', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    startedDate: date('started_date').notNull(),
    positionId: smallint('position_id').notNull(),
    ...commonFields(),
});

export const orders = pgTable('orders', {
    orderId: bigserial('order_id', { mode: 'number' }).primaryKey(),
    itemName: varchar('item_name', { length: 15 }).notNull(),
    itemCode: varchar('item_code', { length: 7 }),
    itemQuantity: integer('item_quantity').notNull(),
    customerId: bigint('customer_id', { mode: 'number' }).references(() => customers.id, refOpt).notNull(),
    ...commonFields()
});
