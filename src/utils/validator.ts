import type { EventHandlerRequest, H3Event } from 'h3';
import { StatusCodes } from 'http-status-codes';

type Schema<T> = {
  validate: (
    value: any,
    option: { abortEarly?: boolean; stripUnknown?: boolean },
  ) => T | Promise<T>;
};

export const toParser =
  <T>(schema: Schema<T>) =>
  (value: any) =>
    schema.validate(value, { abortEarly: false, stripUnknown: true });

export const readData = <T>(
  event: H3Event<EventHandlerRequest>,
  schema: Schema<T>,
) => readValidatedBody(event, toParser(schema));

export const readQuery = <T>(
  event: H3Event<EventHandlerRequest>,
  schema: Schema<T>,
) => getValidatedQuery(event, toParser(schema));

export const getIdParam = <T extends string = 'id'>(
  event: H3Event<EventHandlerRequest>,
  paramName: T = 'id' as any,
) => {
  const params = getRouterParams(event);
  const value = params[paramName];

  const numValue = Number(value);

  if (
    !value ||
    isNaN(numValue) ||
    !Number.isInteger(numValue) ||
    numValue <= 0
  ) {
    throw createError({
      status: StatusCodes.BAD_REQUEST,
      statusMessage: 'Invalid ID parameter',
    });
  }

  return numValue;
};
