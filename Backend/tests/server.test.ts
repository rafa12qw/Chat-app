import request from "supertest";
import ioClient from "socket.io-client";
import { describe, expect, it } from "@jest/globals";

const SERVER_URL = "http://localhost:3001";

describe('Test of server Express and Socket.io works',() => {

    it("It should get response 200 of route base", async () => {
        const response = await request(SERVER_URL).get("/");
        expect(response.statusCode).toBe(200);
    });

    it("It should connect to the Socket.io server", (done) => {
        const client = ioClient(SERVER_URL);

        client.on("connect",() => {
            expect(client.connected).toBe(true);
            client.disconnect();
            done();
        })

        client.on("connect_error",(error) => {
            done(error);
        });
    });
})