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
    },
    admissionStatus: {
        type: DataTypes.ENUM('Pending', 'Admitted', 'Discharged'),
        defaultValue: 'Pending'
    },
    missedMedications: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    fallRisk: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        defaultValue: 'Low'
    },
    lastBMHours: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    mealIntake: {
        type: DataTypes.STRING,
        defaultValue: 'Normal' // e.g., '<25%', '>50%', 'Normal'
    },
    isDrowsy: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Association
Patient.belongsTo(Doctor, { foreignKey: 'assignedDoctorId' });

module.exports = Patient;
