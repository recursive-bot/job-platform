jest.mock("redis");
jest.mock("amqplib");

const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/database");

describe("Auth APIs", () => {

    beforeAll(async () => {

        await sequelize.sync({
            force: true
        });

    });

    afterAll(async () => {

        await sequelize.close();

    });

    test(
        "should register a user",
        async () => {

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Pavan",
                    email: "pavan@test.com",
                    password: "password123"
                });

            expect(response.status).toBe(201);

            expect(response.body).toHaveProperty("id");

            expect(response.body.email)
                .toBe("pavan@test.com");

        }
    );

    test(
        "should login a user",
        async () => {

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "pavan@test.com",
                    password: "password123"
                });

            expect(response.status).toBe(200);

            expect(response.body)
                .toHaveProperty("token");

        }
    );

    test(
        "should get current user profile",
        async () => {

            const loginResponse =
                await request(app)
                    .post("/api/auth/login")
                    .send({
                        email: "pavan@test.com",
                        password: "password123"
                    });

            const token =
                loginResponse.body.token;

            const response =
                await request(app)
                    .get("/api/users/me")
                    .set(
                        "Authorization",
                        `Bearer ${token}`
                    );

            expect(response.status).toBe(200);

        }
    );

});