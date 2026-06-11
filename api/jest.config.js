module.exports = {

    testEnvironment: "node",

    testMatch: [
        "**/__tests__/**/*.test.js"
    ],

    collectCoverageFrom: [

        "src/**/*.js",

        "!src/server.js",

        "!src/config/logger.js"
    ],

    clearMocks: true,

    verbose: true
};