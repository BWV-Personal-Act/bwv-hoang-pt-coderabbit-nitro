import { drizzle } from 'drizzle-orm/postgres-js';

import * as allSchema from '../schema';

export type Drz = Awaited<ReturnType<typeof drizzle>>;
export type Models = typeof allSchema;
export type ModelName = keyof Models;
export type Model = Models[ModelName];

export abstract class BaseRepository<T extends ModelName> {
  public readonly db: Drz;
  public readonly models = allSchema;
  public readonly model: Models[T];

  constructor(db: Drz, modelName: T) {
    this.db = db;
    this.model = this.models[modelName];
  }
}
