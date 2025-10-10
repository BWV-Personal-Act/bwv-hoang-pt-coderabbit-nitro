import {
  and,
  asc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  like,
  lte,
  sql,
} from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { messages } from '~/factory/constant';
import {
  CustomerCreateParams,
  CustomerSearchParams,
  CustomerUpdateParams,
  ICustomerSearchResponse,
  ICustomerSearchResult,
  IOrderResult,
} from '~/factory/customer';
import { orders } from '~/schema';
import { noRecordCondition } from '~/utils/sql';

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

  async searchId(id: number): Promise<typeof this.model.$inferSelect> {
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

  async update(id: number, data: CustomerUpdateParams) {
    // Check if customer exists and not deleted
    const [existingCustomer] = await this.db
      .select()
      .from(this.model)
      .where(and(eq(this.model.id, id), isNull(this.model.deletedAt)));

    if (!existingCustomer) {
      throw createError({
        status: StatusCodes.NOT_FOUND,
        statusMessage: messages.notFound(`Customer.id = ${id}`),
      });
    }

    // TODO: Add authentication check
    // If login user's position_id != 0 AND login user's customer.id != id
    // throw 404 error

    // Prepare update data
    const updateData: any = {
      name: data.name,
      email: data.email,
      positionId: data.positionId,
      startedDate: data.startedDate,
      updatedAt: new Date(),
    };

    // Only update password if it's provided
    if (data.password !== undefined) {
      updateData.password = data.password;
    }

    const [result] = await this.db
      .update(this.model)
      .set(updateData)
      .where(eq(this.model.id, id))
      .returning({
        id: this.model.id,
      });

    return result;
  }

  async delete(id: number) {
    // Check if customer exists and not deleted
    const [existingCustomer] = await this.db
      .select()
      .from(this.model)
      .where(and(eq(this.model.id, id), isNull(this.model.deletedAt)));

    if (!existingCustomer) {
      throw createError({
        status: StatusCodes.NOT_FOUND,
        statusMessage: messages.notFound(`Customer.id = ${id}`),
      });
    }

    // TODO: Add authentication check
    // If login user's position_id != 0, throw 403 error
    // If trying to delete the login user, throw deleteError

    // Soft delete by setting deletedAt timestamp
    await this.db
      .update(this.model)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(this.model.id, id));
  }

  async search(params: CustomerSearchParams): Promise<ICustomerSearchResponse> {
    const { limit, offset } = params;

    // Build where conditions
    let whereConditions = [isNull(this.model.deletedAt)];

    if (params.name) {
      whereConditions.push(like(this.model.name, `%${params.name}%`));
    }

    if (params.positionId) {
      const positionId = Number(params.positionId);
      if (isNaN(positionId)) {
        whereConditions = [noRecordCondition];
      } else {
        whereConditions.push(eq(this.model.positionId, positionId));
      }
    }

    if (params.startedDateFrom) {
      whereConditions.push(gte(this.model.startedDate, params.startedDateFrom));
    }

    if (params.startedDateTo) {
      whereConditions.push(lte(this.model.startedDate, params.startedDateTo));
    }

    // Get total count
    const totalCountResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.model)
      .where(and(...whereConditions));

    const totalCount = Number(totalCountResult[0]?.count ?? 0);

    // Get customers with pagination and ordering
    const customerResults = await this.db
      .select({
        id: this.model.id,
        email: this.model.email,
        name: this.model.name,
        startedDate: this.model.startedDate,
        positionId: this.model.positionId,
      })
      .from(this.model)
      .where(and(...whereConditions))
      .orderBy(
        asc(this.model.name),
        asc(this.model.startedDate),
        asc(this.model.id),
      )
      .limit(limit)
      .offset(offset);

    // Get orders for each customer
    const customerIds = customerResults.map((c) => c.id);
    const ordersResult =
      customerIds.length > 0
        ? await this.db
            .select({
              orderId: orders.orderId,
              itemName: orders.itemName,
              createdDate: orders.createdAt,
              customerId: orders.customerId,
            })
            .from(orders)
            .where(
              and(
                inArray(orders.customerId, customerIds),
                isNull(orders.deletedAt),
              ),
            )
            .orderBy(asc(orders.createdAt))
        : [];

    // Group orders by customer ID
    const ordersByCustomer = ordersResult.reduce(
      (acc, order) => {
        if (!acc[order.customerId]) {
          acc[order.customerId] = [];
        }
        acc[order.customerId].push({
          id: order.orderId,
          itemName: order.itemName,
          createdDate: order.createdDate.toISOString().split('T')[0],
        });
        return acc;
      },
      {} as Record<number, IOrderResult[]>,
    );

    // Build final result
    const customer: ICustomerSearchResult[] = customerResults.map(
      (customer) => ({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        startedDate: customer.startedDate,
        positionId: customer.positionId,
        orders: ordersByCustomer[customer.id] || [],
      }),
    );

    return {
      totalCount,
      customer,
    };
  }
}
