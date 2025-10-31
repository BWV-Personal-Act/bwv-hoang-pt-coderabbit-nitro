import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';

type Payload = {
  id: number;
  email: string;
  positionId: number;
};

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} = process.env;

export const createTokens = (payload: Payload) => {
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN as StringValue,
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as StringValue,
  });

  return { accessToken, refreshToken };
};
