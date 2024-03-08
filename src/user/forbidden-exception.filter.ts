/* eslint-disable prettier/prettier */
import { Catch, ExceptionFilter, ArgumentsHost, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(403).json({
      statusCode: 403,
      message: exception.message || 'Forbidden',
    });
  }
}
