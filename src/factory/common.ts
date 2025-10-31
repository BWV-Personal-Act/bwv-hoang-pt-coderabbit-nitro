import * as yup from './_yup';

export enum YesFlag {
  YES = 1,
  NO = 0,
}

export enum Positions {
  管理者 = 0,
  グループ管理者 = 1,
  一般ユーザ = 2,
}

export interface ICommonAttr {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const numOrUndefined = (defaultValue: number) => (value: number) => {
  const numValue = Number(value);
  return isNaN(numValue) ? defaultValue : numValue;
};

// Transform offset from page number to actual offset
// Formula: (offset - 1) * limit
// Default: offset = 1 means start from record 0
const transformOffset = (value: any, _originalValue: any, context: any) => {
  const numValue = Number(value);
  const offset = isNaN(numValue) ? 1 : numValue;
  const limit = context.parent.limit || 10;
  return (offset - 1) * limit;
};

export const commonSearchSchema = {
  limit: yup.mixed<number>().transform(numOrUndefined(10)).notRequired(),
  offset: yup.mixed<number>().transform(transformOffset).notRequired(),
};
