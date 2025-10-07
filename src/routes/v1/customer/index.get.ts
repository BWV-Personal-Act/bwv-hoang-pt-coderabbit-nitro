import { customerSearchSchema } from '~/factory/customer';
import { CustomerRepository } from '~/repository/customer';
import { readQuery } from '~/utils/validator';

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    total_count: number;
    customer?: Array<{
      id: string;
      email: string;
      name: string;
      started_date: string;
      position_id?: string;
      orders?: Array<{
        id: string;
        item_name: string;
        created_date: string;
      }>;
    }>;
  }> => {
    const query = await readQuery(event, customerSearchSchema);

    const customerRepo = new CustomerRepository(event.context.db);

    const result = await customerRepo.search(query);

    // Transform the response to match the API documentation format
    return {
      total_count: result.totalCount,
      customer: result.customer?.map((customer) => ({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        started_date: customer.startedDate,
        position_id: customer.positionId,
        orders: customer.orders?.map((order) => ({
          id: order.id,
          item_name: order.itemName,
          created_date: order.createdDate,
        })),
      })),
    };
  },
);
