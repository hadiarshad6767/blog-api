
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ErrorResponse } from '../../common/interfaces/error-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let errorType: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      // If message is nested, flatten it
      if (typeof res === 'object' && (res as any).message) {
        message = (res as any).message;
      } else {
        message = res as string;
      }
      errorType = exception.constructor.name;
    } else if (exception instanceof QueryFailedError) {
      status = 400; // or 500 depending on use case
      message = (exception as any).message;
      errorType = 'QueryFailedError';
    } else if (exception instanceof Error) {
      status = 500;
      message = exception.message;
      errorType = exception.constructor.name;
    } else {
      status = 500;
      message = 'Internal server error';
      errorType = 'UnknownError';
    }

    // const errorResponse = {
    //   statusCode: status,
    //   errorType,
    //   message,
    //   path: request.url,
    //   method: request.method,
    //   timestamp: new Date().toISOString(),
    // };
   const errorResponse: ErrorResponse = {
      statusCode: status,
      errorType,
      message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };
    response.status(status).json(errorResponse);
  }
}
