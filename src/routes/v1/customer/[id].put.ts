import { customerUpdateSchema } from '~/factory/customer';
import { CustomerRepository } from '~/repository/customer';
import { readData } from '~/utils/validator';

export default defineEventHandler(async (event): Promise<{ id: number }> => {
  const id = getIdParam(event);
  const body = await readData(event, customerUpdateSchema);

  const customerRepo = new CustomerRepository(event.context.db);

  const result = await customerRepo.update(id, body);

  return result;
});
