import { InferType, object } from 'yup';

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
