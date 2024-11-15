const { Sequelize } = require("sequelize");
require('dotenv').config();

module.exports = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    dialect: process.env.MYSQL_DIALECT,
    host: process.env.MYSQL_HOST,
  }
);
