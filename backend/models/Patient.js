const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor');

const Patient = sequelize.define('Patient', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    symptoms: {
        type: DataTypes.STRING,
        allowNull: false
    },
    severity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10
        }
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roomNumber: {
        type: DataTypes.STRING
    },
    diagnosis: {
        type: DataTypes.STRING
    },
    triageLevel: {
        type: DataTypes.ENUM('Low', 'Moderate', 'Critical'),
        defaultValue: 'Low'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id',
        }
    }
});

// Association
Patient.belongsTo(Doctor, { foreignKey: 'assignedDoctorId' });

module.exports = Patient;
