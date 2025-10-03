import { CustomerRepository } from '~/repository/customer';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const customerrepo = new CustomerRepository(event.context.db);

  return customerrepo.searchId(+id);
});
