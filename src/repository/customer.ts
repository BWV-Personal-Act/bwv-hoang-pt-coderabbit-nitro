import {
  and,
  asc,
  eq,
  gte,
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
  ICustomerSearchResponse,
  ICustomerSearchResult,
  IOrderResult,
} from '~/factory/customer';
import { orders } from '~/schema';

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

  async search(params: CustomerSearchParams): Promise<ICustomerSearchResponse> {
    // Build where conditions
    const whereConditions = [isNull(this.model.deletedAt)];

    if (params.name) {
      whereConditions.push(like(this.model.name, `%${params.name}%`));
    }

    if (params.positionId) {
      whereConditions.push(
        eq(this.model.positionId, parseInt(params.positionId)),
      );
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

    const totalCount = totalCountResult[0]?.count || 0;

    // Parse pagination parameters
    const limit = params.limit ? parseInt(params.limit) : 10;
    const offset = params.offset ? parseInt(params.offset) : 0;

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
                sql`${orders.customerId} = ANY(${customerIds})`,
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
          id: order.orderId.toString(),
          itemName: order.itemName,
          createdDate: order.createdDate.toISOString().split('T')[0],
        });
        return acc;
      },
      {} as Record<number, IOrderResult[]>,
    );

    // Map position IDs to names
    const positionNames: Record<number, string> = {
      0: '管理者',
      1: 'グループ管理者',
      2: '一般ユーザ',
    };

    // Build final result
    const customer: ICustomerSearchResult[] = customerResults.map(
      (customer) => ({
        id: customer.id.toString(),
        email: customer.email,
        name: customer.name,
        startedDate: customer.startedDate,
        positionId: positionNames[customer.positionId],
        orders: ordersByCustomer[customer.id] || [],
      }),
    );

    return {
      totalCount,
      customer: customer.length > 0 ? customer : undefined,
    };
  }
}
