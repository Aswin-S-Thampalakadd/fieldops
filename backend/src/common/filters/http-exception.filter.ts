import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const response = context.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const body = exceptionResponse as {
          message?: string | string[];
          error?: string;
        };

        if (Array.isArray(body.message)) {
          message = body.message.join(', ');
        } else if (body.message) {
          message = body.message;
        }

        code = body.error ?? this.statusToCode(status);
      }
    }

    response.status(status).json({
      statusCode: status,
      code,
      message,
      timestamp: new Date().toISOString(),
      path: context.getRequest<Request>().url,
    });
  }

  private statusToCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';

      case 401:
        return 'UNAUTHORIZED';

      case 403:
        return 'FORBIDDEN';

      case 404:
        return 'NOT_FOUND';

      case 409:
        return 'CONFLICT';

      case 422:
        return 'UNPROCESSABLE_ENTITY';

      default:
        return 'HTTP_ERROR';
    }
  }
}
