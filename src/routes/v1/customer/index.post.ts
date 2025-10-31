import { customerCreateSchema } from '~/factory/customer';
import { CustomerRepository } from '~/repository/customer';
import { readData } from '~/utils/validator';

export default defineEventHandler(async (event): Promise<{ id: number }[]> => {
  const body = await readData(event, customerCreateSchema);

  const customerRepo = new CustomerRepository(event.context.db);

  return customerRepo.create(body, event.context.user);
});
