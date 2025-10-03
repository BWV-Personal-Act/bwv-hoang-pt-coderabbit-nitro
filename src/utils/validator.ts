import type { EventHandlerRequest, H3Event } from 'h3';

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
