import { customerUpdateSchema } from '~/factory/customer';
import { CustomerRepository } from '~/repository/customer';

export default defineEventHandler(async (event): Promise<{ id: number }> => {
  const id = getIdParam(event);
  const body = await readData(event, customerUpdateSchema);

  const customerRepo = new CustomerRepository(event.context.db);

  const result = await customerRepo.update(id, body, event.context.user);

  return result;
});
