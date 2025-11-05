import { IOrderSearchResponse, orderSearchSchema } from '~/factory/order';
import { OrderRepository } from '~/repository/order';
import { readQuery } from '~/utils/validator';

export default defineEventHandler(
  async (event): Promise<IOrderSearchResponse> => {
    const query = await readQuery(event, orderSearchSchema);

    const orderRepo = new OrderRepository(event.context.db);

    return orderRepo.search(query, event.context.user);
  },
);
