const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      "PENDING",
      "PROCESSING",
      "COMPLETED",
      "FAILED"
    ),
    defaultValue: "PENDING"
  },

  result: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Job;