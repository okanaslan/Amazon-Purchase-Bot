import { Request, Response } from "express";

export class UserController {
    static get(_request: Request, response: Response): void {
        response.json({
            username: "okanaslan",
        });
    }
}
