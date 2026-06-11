require("dotenv").config();

const amqp = require("amqplib");

const Job = require("./Job");

const sequelize = require("./database");

const {
    connectRedis,
    client
} = require("./redis");

async function connectDB() {

    let retries = 20;

    while (retries > 0) {

        try {

            await sequelize.authenticate();

            console.log(
                "Worker DB Connected"
            );

            return;

        } catch (err) {

            retries--;

            console.log(
                `DB Connection Failed. Retries left: ${retries}`
            );

            console.log(err.message);

            await new Promise(resolve =>
                setTimeout(resolve, 5000)
            );
        }
    }

    throw new Error(
        "Unable to connect to PostgreSQL"
    );
}

async function connectRabbitMQ() {

    let retries = 20;

    while (retries > 0) {

        try {

            console.log(
                `Connecting to RabbitMQ... (${21 - retries}/20)`
            );

            const connection =
                await amqp.connect(
                    process.env.RABBITMQ_URL
                );

            connection.on(
                "error",
                err => {

                    console.error(
                        "RabbitMQ Connection Error:",
                        err.message
                    );

                }
            );

            console.log(
                "Worker RabbitMQ Connected"
            );

            return connection;

        } catch (err) {

            retries--;

            console.log(
                `RabbitMQ unavailable. Retries left: ${retries}`
            );

            console.log(
                err.message
            );

            await new Promise(resolve =>
                setTimeout(resolve, 5000)
            );
        }
    }

    throw new Error(
        "Unable to connect to RabbitMQ"
    );
}

async function start() {

    try {

        await connectDB();

        await connectRedis();

        console.log(
            "Worker Redis Connected"
        );

        const connection =
            await connectRabbitMQ();

        const channel =
            await connection.createChannel();

        await channel.assertQueue(
            "jobs",
            {
                durable: true
            }
        );

        console.log(
            "Worker Waiting for Jobs..."
        );

        channel.consume(
            "jobs",
            async (msg) => {

                if (!msg) return;

                const data =
                    JSON.parse(
                        msg.content.toString()
                    );

                const job =
                    await Job.findByPk(
                        data.jobId
                    );

                if (!job) {

                    channel.ack(msg);

                    return;
                }

                console.log(
                    `Processing Job ${job.id}`
                );

                try {

                    job.status =
                        "PROCESSING";

                    await job.save();

                    await client.del(
                        `job:${job.id}`
                    );

                    for (
                        let i = 1;
                        i <= 10;
                        i++
                    ) {

                        await client.set(
                            `job:${job.id}:progress`,
                            i * 10
                        );

                        await new Promise(
                            resolve =>
                                setTimeout(
                                    resolve,
                                    1000
                                )
                        );
                    }

                    job.status =
                        "COMPLETED";

                    job.result =
                        `Completed ${job.type}`;

                    await job.save();

                    await client.del(
                        `job:${job.id}`
                    );

                    console.log(
                        `Job ${job.id} Completed`
                    );

                } catch (err) {

                    console.error(
                        `Job ${job.id} Failed`,
                        err
                    );

                    job.status =
                        "FAILED";

                    await job.save();

                    await client.del(
                        `job:${job.id}`
                    );
                }

                channel.ack(msg);

            },
            {
                noAck: false
            }
        );

        process.on(
            "SIGTERM",
            async () => {

                console.log(
                    "Worker shutting down..."
                );

                await sequelize.close();

                await client.quit();

                await channel.close();

                await connection.close();

                process.exit(0);

            }
        );

        process.on(
            "SIGINT",
            async () => {

                console.log(
                    "Worker shutting down..."
                );

                await sequelize.close();

                await client.quit();

                await channel.close();

                await connection.close();

                process.exit(0);

            }
        );

    } catch (err) {

        console.error(
            "Worker startup failed:",
            err
        );

        process.exit(1);
    }
}

start();