import {CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor} from '@nestjs/common'
import {Observable, catchError, throwError} from 'rxjs'

@Injectable()
export class AppLogger implements NestInterceptor {
    private readonly logger = new Logger(AppLogger.name)

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        return next.handle().pipe(
            catchError((error) => {
                if(error instanceof HttpException) {
                    return throwError(() => new HttpException(Array.isArray((error as any).response) ? (error as any).response.message : (error as any).response, (error as any).status));
                }
                const _error = error as AppError
                const {error: originalError} = (error as AppError)
                if (originalError?.name === 'PrismaClientKnownRequestError') {
                    this.logger.error({
                        url: request.url,
                        method: context.getHandler().name,
                        message: _error.message,
                        payload: _error.payload,
                    })
                    return throwError(() => new HttpException(_error.responseMessage, HttpStatus.BAD_REQUEST));
                }
                if (originalError.name !== 'HttpException') {
                    this.logger.error({
                        url: request.url,
                        method: context.getHandler().name,
                        message: _error.message,
                        payload: _error.payload,
                    })
                    return throwError(() => new HttpException(_error.responseMessage, HttpStatus.BAD_GATEWAY));
                }
                return throwError(() => new HttpException(originalError.message, (originalError as Error & {status: number}).status));
            })
        )
    }
}

export class AppError extends Error {
    public payload: any;
    public error: Error;
    public responseMessage: string;
    constructor(data: {error: any; responseMessage: string; payload?: any}) {
        super((data.error as Error).message)
        this.responseMessage = data.responseMessage
        this.payload = data.payload
        this.error = data.error as Error
    }
}
