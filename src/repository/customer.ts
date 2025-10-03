import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { messages } from '~/factory/constant';
import { CustomerCreateParams } from '~/factory/customer';

import { BaseRepository, Drz } from './_base';

export class CustomerRepository extends BaseRepository<'customers'> {
  constructor(db: Drz) {
    super(db, 'customers');
  }

  async create(data: CustomerCreateParams) {
    const [existingCustomer] = await this.db
      .select()
      .from(this.model)
      .where(eq(this.model.email, data.email));

    if (existingCustomer) {
      throw createError({
        status: StatusCodes.BAD_REQUEST,
        statusMessage: messages.alreadyExist('Customer'),
      });
    }

    return this.db.insert(this.model).values(data).returning({
      id: this.model.id,
    });
  }
}
