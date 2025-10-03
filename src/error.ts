import { StatusCodes } from 'http-status-codes';
import type { NitroErrorHandler } from 'nitropack';
import { ValidationError } from 'yup';

export default defineNitroErrorHandler(((error, event) => {
  console.log(error);
  setResponseHeader(event, 'Content-Type', 'application/json');
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR as number;
  let body: any = { message: 'ERROR' };

  if (error.data instanceof ValidationError) {
    statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    body = { errors: error.data.errors };
  }

  if (
    error.statusCode === StatusCodes.FORBIDDEN ||
    error.statusCode === StatusCodes.UNAUTHORIZED
  ) {
    statusCode = error.statusCode;
    body = { message: error.message };
  }

  if (
    error.statusCode === StatusCodes.NOT_FOUND ||
    error.statusCode === StatusCodes.METHOD_NOT_ALLOWED
  ) {
    statusCode = StatusCodes.NOT_FOUND;
    body = { message: error.message };
  }

  if (error.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    if (error.cause instanceof ValidationError) {
      statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
      body = { message: error.cause.message };
    }
  }

  setResponseStatus(event, statusCode);
  return send(event, JSON.stringify(body));
}) as NitroErrorHandler);
