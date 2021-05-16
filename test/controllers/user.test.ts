import { server } from "../../src/server";
import supertest from "supertest";

describe("# Item", () => {
    describe("Get /user", () => {
        test("Should return a user.", async () => {
            const response = await supertest(server).get("/user").auth("", { type: "bearer" }).set("Accept", "application/json");
            expect(response.body.username).toBe("okanaslan");
        });
    });
});
