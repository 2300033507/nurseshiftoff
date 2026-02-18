const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'ai_nursing_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'Vikas@2005',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

module.exports = sequelize;
