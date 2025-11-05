import { InferType, object, string } from 'yup';

import { nat } from './_yup';
import { commonSearchSchema } from './common';

export interface IOrderSearchQuery {
  limit?: string;
  offset?: string;
}

export interface IOrderSearchResponse {
  total_count: number;
  order?: IOrderSearchResult[];
}

export interface IOrderSearchResult {
  id: string;
  item_name: string;
  item_code: string;
  item_quantity: string;
  created_date: string;
  updated_date: string;
  deleted_date: string;
  customer: {
    id: string;
    name: string;
  };
}

export const orderSearchSchema = object({
  ...commonSearchSchema,
});

export type OrderSearchParams = InferType<typeof orderSearchSchema>;

export const orderCreateSchema = object({
  item_name: string().required().max(15),
  item_code: string().max(7),
  item_quantity: nat().required(),
  customer_id: nat().max(19).required(),
});

export type OrderCreateParams = InferType<typeof orderCreateSchema>;
