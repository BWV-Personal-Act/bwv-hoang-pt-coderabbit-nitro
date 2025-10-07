import { InferType, object, string } from 'yup';

import { nat } from './_yup';
import { ICommonAttr, Position } from './common';

export interface ICustomerMainAttr {
  name: string;
  email: string;
  positionId: Position;
  startedDate: string;
  password: string;
}

export interface ICustomerAttr extends ICustomerMainAttr, ICommonAttr {}

export const customerCreateFields = {
  name: string().max(100).required(),
  email: string().email().max(255).required(),
  positionId: nat().required().valueOf(Position),
  startedDate: string().dateFormat('YYYY-MM-DD').required(),
  password: string().max(255).required(),
};

export const customerCreateSchema = object(customerCreateFields);

export type CustomerCreateParams = InferType<typeof customerCreateSchema>;

// Customer Search interfaces and schemas
export interface ICustomerSearchQuery {
  name?: string;
  positionId?: string;
  startedDateFrom?: string;
  startedDateTo?: string;
  limit?: string;
  offset?: string;
}

export interface ICustomerSearchResponse {
  totalCount: number;
  customer?: ICustomerSearchResult[];
}

export interface ICustomerSearchResult {
  id: string;
  email: string;
  name: string;
  startedDate: string;
  positionId?: string;
  orders?: IOrderResult[];
}

export interface IOrderResult {
  id: string;
  itemName: string;
  createdDate: string;
}

export const customerSearchFields = {
  name: string().optional(),
  positionId: string().optional(),
  startedDateFrom: string().dateFormat('YYYY-MM-DD').optional(),
  startedDateTo: string().dateFormat('YYYY-MM-DD').optional(),
  limit: string().optional(),
  offset: string().optional(),
};

export const customerSearchSchema = object(customerSearchFields);

export type CustomerSearchParams = InferType<typeof customerSearchSchema>;
