const { DataTypes } = require("sequelize");
const sequelize  = require("../config/database");

const Session = sequelize.define(
  "Session",
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: "session_id", // Map `sid` to `session_id`
    },
    expires: {
      type: DataTypes.DATE,
    },
    data: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Sessions", // Ensure it matches your MySQL table
    timestamps: false, // No createdAt/updatedAt columns
  }
);

module.exports = Session;
