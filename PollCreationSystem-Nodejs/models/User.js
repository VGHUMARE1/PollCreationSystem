const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Ensure correct import

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true, // Set email as primary key
    validate: {
      isEmail: true, // Ensures valid email format
    },
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true, // Matches DEFAULT NULL constraint
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true, // Matches DEFAULT NULL constraint
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Matches DEFAULT NULL constraint
  },
  phone_no: {
    type: DataTypes.STRING,
    allowNull: true, // Matches DEFAULT NULL constraint
  },
}, {
  tableName: "user", // Matches table name in MySQL
  timestamps: false, // No timestamps as per given schema
});

module.exports = User;