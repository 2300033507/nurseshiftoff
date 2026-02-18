const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currentLoad: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    maxLoad: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Doctor;
