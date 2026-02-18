const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Doctor = require('./Doctor');

const Appointment = sequelize.define('Appointment', {
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    requestedDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled'),
        defaultValue: 'Pending'
    }
});

// Associations
// Appointment belongs to a Patient (User with role Patient)
Appointment.belongsTo(User, { as: 'Patient', foreignKey: 'patientId' });
// Appointment optionally belongs to a Doctor
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

module.exports = Appointment;
