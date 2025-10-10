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

export const commonSearchSchema = {
  limit: yup.mixed<number>().transform(numOrUndefined(10)).notRequired(),
  offset: yup.mixed<number>().transform(numOrUndefined(0)).notRequired(),
};
