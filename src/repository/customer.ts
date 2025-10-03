import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { CustomerCreateParams } from '~/factory/user';
import { BaseRepository, Drz } from './_base';
import { messages } from '~/factory/constant';

export class CustomerRepository extends BaseRepository<'customers'> {
  constructor(db: Drz) {
    super(db, 'customers');
  }

  async Create(data: CustomerCreateParams) {
    const [existinguser] = await this.db
      .select()
      .from(this.model)
      .where(eq(this.model.email, data.email));

    if (existinguser) {
      throw createError({
        status: StatusCodes.BAD_REQUEST,
        statusMessage: messages.alreadyExist('Customer'),
      });
    }

    console.log('data', data);

    return this.db.insert(this.model).values(data).returning({
      id: this.model.id,
    });
  }
}
