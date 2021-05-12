import { Router, Response, Request } from "express";

import { UserController } from "./controllers/userController";
import { LoggerMiddleware } from "./middlewares/loggerMiddleware";

const router = Router();

router.use(LoggerMiddleware.log);

router.get("/", (request: Request, response: Response): void => {
    request.method;
    response.json({});
});

router.get("/user", UserController.get);

export { router };
