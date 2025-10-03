import {
  type CustomerCreateParams,
  customerCreateSchema,
} from '~/factory/user';
import { CustomerRepository } from '~/repository/customer';
import { readData } from '~/utils/validator';

export default defineEventHandler(async (event) => {
  const body = await readData(event, customerCreateSchema);

  const userrepo = new CustomerRepository(event.context.db);

  return userrepo.Create(body as CustomerCreateParams);
});
