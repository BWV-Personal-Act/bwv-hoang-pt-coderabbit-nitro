import { and, eq, isNotNull } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { messages } from '~/factory/constant';
import { CustomerCreateParams } from '~/factory/customer';

import { BaseRepository, Drz } from './_base';

export class CustomerRepository extends BaseRepository<'customers'> {
  constructor(db: Drz) {
    super(db, 'customers');
  }

  async create(data: CustomerCreateParams) {
    const [ExistingCustomer] = await this.db
      .select()
      .from(this.model)
      .where(eq(this.model.email, data.email));

    if (ExistingCustomer) {
      throw createError({
        status: StatusCodes.BAD_REQUEST,
        statusMessage: messages.alreadyExist('Customer'),
      });
    }

    return this.db
      .insert(this.model)
      .values(data as typeof this.model.$inferInsert)
      .returning({
        id: this.model.id,
      });
  }

  async searchId(id: number) {
    const [customer] = await this.db
      .select()
      .from(this.model)
      .where(and(eq(this.model.id, id), isNotNull(this.model.createdAt)));

    if (!customer) {
      throw createError({
        status: StatusCodes.NOT_FOUND,
        statusMessage: messages.notFound(`Customer.id = ${id}`),
      });
    }

    return customer;
  }
}
