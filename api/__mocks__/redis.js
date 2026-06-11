module.exports = {

    createClient: jest.fn(() => ({

        connect:
        jest.fn(),

        get:
        jest.fn(),

        set:
        jest.fn(),

        del:
        jest.fn(),

        incr:
        jest.fn(),

        expire:
        jest.fn(),

        quit:
        jest.fn(),

        on:
        jest.fn()

    }))
};