import { and, eq, isNull } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { LoginParams } from '~/factory/auth';

import { BaseRepository, Drz } from './_base';

export class AuthRepository extends BaseRepository<'customers'> {
  constructor(db: Drz) {
    super(db, 'customers');
  }

  async login(data: LoginParams) {
    // Find customer with matching email and not deleted
    const [customer] = await this.db
      .select()
      .from(this.model)
      .where(
        and(eq(this.model.email, data.email), isNull(this.model.deletedAt)),
      );

    // Check if customer exists, password matches, and not deleted
    if (!customer || customer.password !== data.password) {
      throw createError({
        status: StatusCodes.BAD_REQUEST,
        statusMessage: 'Login information is incorrect',
      });
    }

    // Generate tokens (simplified version - in production use JWT)
    const accessToken = `access_${customer.id}_${Date.now()}`;
    const refreshToken = `refresh_${customer.id}_${Date.now()}`;

    return {
      id: String(customer.id),
      email: customer.email,
      name: customer.name,
      started_date: customer.startedDate,
      position_id: String(customer.positionId),
      created_date: customer.createdAt.toISOString().split('T')[0],
      updated_date: customer.updatedAt.toISOString().split('T')[0],
      token: {
        accessToken,
        refreshToken,
      },
    };
  }
}
