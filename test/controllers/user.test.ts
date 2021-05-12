import { server } from "../../src/server";
import supertest from "supertest";
import { Database } from "../../src/database";
import { Connection } from "mongoose";
import { config } from "dotenv";

describe("# User", () => {
    let mongo: Connection;

    beforeAll(async () => {
        config();
        if (process.env.MongoURI != null) {
            try {
                mongo = await Database.connect(process.env.MongoURI!);
            } catch (error) {
                fail(error);
            }
        } else {
            fail("Environment Error");
        }
    });

    afterAll(async () => {
        try {
            await mongo.close();
        } catch (error) {
            fail(error);
        }
    });

    describe("Get /user", () => {
        test("Should return a user.", async () => {
            const response = await supertest(server).get("/user").auth("", { type: "bearer" }).set("Accept", "application/json");
            expect(response.body.username).toBe("okanaslan");
        });
    });
});
