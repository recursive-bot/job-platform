module.exports = {

    connect: jest.fn(
        async () => ({

            createChannel:
            async () => ({

                assertQueue:
                jest.fn(),

                sendToQueue:
                jest.fn(),

                consume:
                jest.fn(),

                ack:
                jest.fn()

            }),

            close:
            jest.fn()

        })
    )
};