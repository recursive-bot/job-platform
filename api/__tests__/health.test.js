const request =
require("supertest");

const app =
require("../src/app");

describe(
    "Health Check",
    () => {

        test(
            "should return UP",
            async () => {

                const response =
                    await request(app)
                        .get("/health");

                expect(
                    response.status
                ).toBe(200);

                expect(
                    response.body.status
                ).toBe("UP");

            }
        );
    }
);