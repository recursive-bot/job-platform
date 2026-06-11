require("dotenv").config();

const app = require("./app");

const sequelize = require("./config/database");

const {
    connectRabbit,
    closeRabbit
} = require("./config/rabbitmq");

const { connectRedis } = require("./config/redis");

const logger = require("./config/logger");

async function connectDB() {

    let retries = 10;

    while (retries > 0) {

        try {

            await sequelize.authenticate();

            logger.info(
                "Database Connected"
            );

            await sequelize.sync();

            logger.info(
                "Database Synced"
            );

            return;

        } catch (err) {

            retries--;

            logger.error(
                `Database connection failed. Retries left: ${retries}`
            );

            logger.error(err);

            if (retries === 0) {

                logger.error(
                    "Could not connect to database"
                );

                process.exit(1);

            }

            await new Promise(resolve =>
                setTimeout(resolve, 5000)
            );

        }
    }
}

async function startServer() {

    try {

        await connectDB();

        await connectRedis();

        logger.info(
            "Redis Connected"
        );

        logger.info(
    "Connecting to RabbitMQ..."
);

await connectRabbit();

logger.info(
    "RabbitMQ Connected"
);

        const server = app.listen(
            process.env.PORT || 5000,
            () => {

                logger.info(
                    `Server running on port ${process.env.PORT || 5000}`
                );

            }
        );

        process.on(
            "SIGTERM",
            async () => {

                logger.info(
                    "SIGTERM received"
                );

                server.close(
                    async () => {

                        await sequelize.close();

                        logger.info(
                            "Database connection closed"
                        );

                        process.exit(0);

                    }
                );
            }
        );

        process.on(
            "SIGINT",
            async () => {

                logger.info(
                    "SIGINT received"
                );

                server.close(
                    async () => {

                        await sequelize.close();

                        logger.info(
                            "Database connection closed"
                        );

                        process.exit(0);

                    }
                );
            }
        );

    } catch (err) {

        logger.error(
            "Failed to start application"
        );

        logger.error(err);

        process.exit(1);

    }
}

startServer();