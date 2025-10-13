import { CustomerRepository } from '~/repository/customer';

export default defineEventHandler(async (event) => {
  const id = getIdParam(event);

  const customerRepo = new CustomerRepository(event.context.db);

  await customerRepo.delete(id, event.context.user);

  // Return 204 No Content
  setResponseStatus(event, 204);
  return;
});
