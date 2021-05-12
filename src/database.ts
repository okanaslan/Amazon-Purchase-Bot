import { connect, Connection } from "mongoose";

export class Database {
    static async connect(connectionURI: string): Promise<Connection> {
        const mongo = await connect(connectionURI, { useNewUrlParser: true, useUnifiedTopology: true });
        return mongo.connection;
    }
}
