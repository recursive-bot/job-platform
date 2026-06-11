test(
    "Create Job",
    async () => {

        const login =
            await request(app)

                .post(
                    "/api/auth/login"
                )

                .send({

                    email:
                    "pavan@test.com",

                    password:
                    "password123"

                });

        const token =
            login.body.token;

        const response =
            await request(app)

                .post(
                    "/api/jobs"
                )

                .set(
                    "Authorization",
                    `Bearer ${token}`
                )

                .send({

                    type:
                    "REPORT"

                });

        expect(
            response.status
        ).toBe(201);

    }
);