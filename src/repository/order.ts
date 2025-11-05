import { desc, eq, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { IOrderSearchResponse, OrderSearchParams } from '~/factory/order';
import { AuthUser } from '~/middleware/1.auth';
import { customers } from '~/schema';

import { BaseRepository, Drz } from './_base';

export class OrderRepository extends BaseRepository<'orders'> {
  constructor(db: Drz) {
    super(db, 'orders');
  }

  async search(
    params: OrderSearchParams,
    user?: AuthUser,
  ): Promise<IOrderSearchResponse> {
    if (!user) {
      throw createError({
        status: StatusCodes.UNAUTHORIZED,
        statusMessage: 'Authentication required',
      });
    }

    if (user.positionId !== 0) {
      throw createError({
        status: StatusCodes.FORBIDDEN,
        statusMessage: 'Access denied',
      });
    }

    const { limit, offset } = params;

    // Check if limit exceeds 100
    if (limit > 100) {
      throw createError({
        status: StatusCodes.BAD_REQUEST,
        statusMessage: 'Limit cannot exceed 100',
      });
    }

    // Get orders with customer info and total count in single query
    const orderResults = await this.db
      .select({
        totalCount: sql<number>`COUNT(*) OVER()`,
        orderId: this.model.orderId,
        itemName: this.model.itemName,
        itemCode: this.model.itemCode,
        itemQuantity: this.model.itemQuantity,
        createdAt: this.model.createdAt,
        updatedAt: this.model.updatedAt,
        deletedAt: this.model.deletedAt,
        customerId: customers.id,
        customerName: customers.name,
      })
      .from(this.model)
      .innerJoin(customers, eq(this.model.customerId, customers.id))
      .orderBy(desc(this.model.createdAt), desc(this.model.orderId))
      .limit(limit)
      .offset(offset);

    const totalCount = orderResults[0]?.totalCount ?? 0;

    // Build final result
    const order = orderResults.map((order) => ({
      id: String(order.orderId),
      item_name: order.itemName,
      item_code: order.itemCode || '',
      item_quantity: String(order.itemQuantity),
      created_date: order.createdAt.toISOString().split('T')[0],
      updated_date: order.updatedAt.toISOString().split('T')[0],
      deleted_date: order.deletedAt
        ? order.deletedAt.toISOString().split('T')[0]
        : '',
      customer: {
        id: String(order.customerId),
        name: order.customerName,
      },
    }));

    return {
      total_count: totalCount,
      order,
    };
  }
}
