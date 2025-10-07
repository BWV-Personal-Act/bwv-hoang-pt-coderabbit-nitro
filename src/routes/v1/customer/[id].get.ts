import { CustomerRepository } from '~/repository/customer';

export default defineEventHandler(async (event) => {
  const id = getIdParam(event);

  const customerrepo = new CustomerRepository(event.context.db);

  return customerrepo.searchId(id);
});
