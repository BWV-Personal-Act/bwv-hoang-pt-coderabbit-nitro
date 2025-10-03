import { date, InferType, number, object, string } from 'yup';

import { ICommonAttr, Position } from './common';
import { nat } from './_yup';

export interface ICustomerMainAttr {
  name: string;
  email: string;
  positionId?: Position;
  startedDate: string;
  password: string;
}

export interface ICustomerAttr extends ICustomerMainAttr, ICommonAttr {}

export const customerCreateFields = {
  name: string().max(100).required(),
  email: string().email().max(255).required(),
  positionId: nat().required().valueOf(Position),
  startedDate: string().required(),
  password: string().max(255).required(),
};

export const customerCreateSchema = object(customerCreateFields);

export type CustomerCreateParams = InferType<typeof customerCreateSchema>;
