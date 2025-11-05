import { CustomerRepository } from '~/repository/customer';

export default defineEventHandler(async (event) => {
  const id = getIdParam(event);

  const customerRepo = new CustomerRepository(event.context.db);

  return customerRepo.searchId(id, event.context.user);
});
