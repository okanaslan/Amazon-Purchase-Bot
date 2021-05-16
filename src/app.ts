import { server } from "./server";
import { config } from "dotenv";
import { SeleniumUtils } from "./utils/seleniumUtils";

config();

server.listen(3000, "Localhost", () => {
    console.info(`Express application listening at http://localhost:3000`);
});

SeleniumUtils.buyAll()
    .then()
    .catch((error) => {
        console.error(error);
    });
