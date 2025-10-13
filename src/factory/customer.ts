import { InferType, object, string } from 'yup';

import { nat } from './_yup';
import { commonSearchSchema, ICommonAttr, Positions } from './common';

export interface ICustomerMainAttr {
  name: string;
  email: string;
  positionId: number;
  startedDate: string;
  password: string;
}

export interface ICustomerAttr extends ICustomerMainAttr, ICommonAttr {}

const customerBaseFields = {
  name: string().max(100).required(),
  email: string().email().max(255).required(),
  positionId: nat().required().valueOf(Positions),
  startedDate: string().dateFormat('YYYY-MM-DD').required(),
};

export const customerCreateSchema = object({
  ...customerBaseFields,
  positionId: nat().optional().valueOf(Positions).default(1),
  password: string().max(255).required(),
});

export type CustomerCreateParams = InferType<typeof customerCreateSchema>;

export const customerUpdateSchema = object({
  ...customerBaseFields,
  password: string().max(255).optional(),
});

export type CustomerUpdateParams = InferType<typeof customerUpdateSchema>;

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
  id: number;
  email: string;
  name: string;
  startedDate: string;
  positionId: number;
  orders?: IOrderResult[];
}

export interface IOrderResult {
  id: number;
  itemName: string;
  createdDate: string;
}

export const customerSearchSchema = object({
  ...commonSearchSchema,
  name: string().optional(),
  positionId: string().optional(),
  startedDateFrom: string().dateFormat('YYYY-MM-DD').optional(),
  startedDateTo: string().dateFormat('YYYY-MM-DD').optional(),
});

export type CustomerSearchParams = InferType<typeof customerSearchSchema>;
