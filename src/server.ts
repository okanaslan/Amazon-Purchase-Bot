import express from "express";
import bodyParser from "body-parser";

import { router } from "./routes";

const server = express();

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

server.use(router);

export { server };
