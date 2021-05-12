import { NextFunction, Response, Request } from "express";

export class LoggerMiddleware {
    static log(request: Request, response: Response, next: NextFunction): void {
        response.app;
        console.log(`${request.method} ${request.path}`);
        next();
    }
}
