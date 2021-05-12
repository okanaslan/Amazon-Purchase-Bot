import { server } from "./server";
import { Database } from "./database";
import { Connection } from "mongoose";
import { config } from "dotenv";

config();
const connectionURI = process.env.MongoURI;

if (connectionURI != null) {
    Database.connect(connectionURI)
        .then((connection: Connection) => {
            console.info(`Database connected to ${connection.host}:${connection.port}/${connection.db.databaseName}`);
            server.listen(3000, "Localhost", () => {
                console.info(`Express application listening at http://localhost:3000`);
            });
        })
        .catch((error) => {
            console.error(error);
        });
} else {
    console.error("Environment missing key: MongoURI");
}
