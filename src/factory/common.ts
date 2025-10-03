export enum YesFlag {
  YES = 1,
  NO = 0,
}

export enum Position {
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
