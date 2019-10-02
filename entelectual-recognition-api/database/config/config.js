require('dotenv').config()

module.exports = {
  development: {
    url: process.env.DATABASE_CONNECTION_STRING,
    dialect: 'postgres',
  }
}