const Sequelize= require("sequelize");
const dotenv = require("dotenv");
dotenv.config(); //  Load environment variables

//  Ensure all required environment variables are defined
const requiredEnv = ["DB_NAME", "DB_USER", "DB_PASS", "DB_HOST"];
requiredEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(` Missing required environment variable: ${envVar}`);
    process.exit(1); // Stop execution if a required variable is missing
  }
});

//  Initialize Sequelize with MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql"
  }
);

//  Function to test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Connected to MySQL successfully.");
  } catch (error) {
    console.error(" Unable to connect to MySQL:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

connectDB();
module.exports=sequelize;
