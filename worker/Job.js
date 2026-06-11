const {
  DataTypes
} =
require("sequelize");

const sequelize =
require("./database");

const Job =
sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },

    type: DataTypes.STRING,

    status: DataTypes.STRING,

    result: DataTypes.TEXT
  }
);

module.exports = Job;