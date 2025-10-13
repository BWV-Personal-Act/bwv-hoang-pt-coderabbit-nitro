import { ILoginResponse,loginSchema } from '~/factory/auth';
import { AuthRepository } from '~/repository/auth';
import { readData } from '~/utils/validator';

export default defineEventHandler(async (event): Promise<ILoginResponse> => {
  const body = await readData(event, loginSchema);

  const authRepo = new AuthRepository(event.context.db);

  return authRepo.login(body);
});
