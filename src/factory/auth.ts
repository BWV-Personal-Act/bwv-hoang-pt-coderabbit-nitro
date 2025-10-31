import { InferType, object, string } from 'yup';

export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,255}$/;

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
  password: string()
    .matches(STRONG_PASSWORD_REGEX, 'Password is not strong enough')
    .required(),
});

export type LoginParams = InferType<typeof loginSchema>;
