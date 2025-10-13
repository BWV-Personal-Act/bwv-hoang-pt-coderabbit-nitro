import { InferType, object, string } from 'yup';

export interface ILoginParams {
  email: string;
  password: string;
}

export interface ILoginResponse {
  id: string;
  email: string;
  name: string;
  started_date: string;
  position_id: string;
  created_date: string;
  updated_date: string;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export const loginSchema = object({
  email: string().email().required(),
  password: string().required(),
});

export type LoginParams = InferType<typeof loginSchema>;
