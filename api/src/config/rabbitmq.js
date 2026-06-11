const amqp = require("amqplib");

let channel;
let connection;

async function connectRabbit() {

    let retries = 20;

    while (retries > 0) {

        try {

            console.log(
                `Connecting to RabbitMQ... (${21 - retries}/20)`
            );

            connection = await amqp.connect(
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

            connection.on(
                "close",
                () => {

                    console.log(
                        "RabbitMQ Connection Closed"
                    );

                }
            );

            channel =
                await connection.createChannel();

            await channel.assertQueue(
                "jobs",
                {
                    durable: true
                }
            );

            await channel.assertQueue(
                "jobs_retry",
                {
                    durable: true
                }
            );

            await channel.assertQueue(
                "jobs_dlq",
                {
                    durable: true
                }
            );

            console.log(
                "RabbitMQ Connected"
            );

            return;

        } catch (err) {

            retries--;

            console.log(
                `RabbitMQ unavailable. Retries left: ${retries}`
            );

            console.log(
                err.message
            );

            if (retries === 0) {

                throw err;
            }

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        5000
                    )
            );
        }
    }
}

function getChannel() {

    if (!channel) {

        throw new Error(
            "RabbitMQ channel not initialized"
        );
    }

    return channel;
}

async function closeRabbit() {

    try {

        if (channel) {

            await channel.close();
        }

        if (connection) {

            await connection.close();
        }

    } catch (err) {

        console.error(
            "Error closing RabbitMQ:",
            err.message
        );
    }
}

module.exports = {
    connectRabbit,
    getChannel,
    closeRabbit
};