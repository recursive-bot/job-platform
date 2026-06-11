const { Sequelize } = require("sequelize");

let sequelize;

// Only use SQLite during Jest tests
const isJest =
    process.env.JEST_WORKER_ID !== undefined;

if (isJest) {

    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    });

} else {

    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: "postgres",
            logging: false
        }
    );
}

module.exports = sequelize;