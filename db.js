const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    models: [__dirname + "/models/*.js"],
    logging: (msg) => {
      return false;
    },
  },
);

module.exports = sequelize;
