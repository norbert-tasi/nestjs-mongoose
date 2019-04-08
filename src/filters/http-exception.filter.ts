import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
}
