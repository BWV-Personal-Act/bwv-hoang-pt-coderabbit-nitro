import { orderCreateSchema } from '~/factory/order';
import { OrderRepository } from '~/repository/order';
import { readData } from '~/utils/validator';

export default defineEventHandler(async (event): Promise<{ id: number }[]> => {
  const body = await readData(event, orderCreateSchema);

  const orderRepo = new OrderRepository(event.context.db);

  return orderRepo.create(body, event.context.user);
});
