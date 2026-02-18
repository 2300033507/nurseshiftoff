const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const Assignment = sequelize.define('Assignment', {
    status: {
        type: DataTypes.ENUM('Active', 'Completed', 'Cancelled'),
        defaultValue: 'Active'
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Associations
Assignment.belongsTo(Patient, { foreignKey: 'patientId' });
Assignment.belongsTo(Doctor, { foreignKey: 'doctorId' });

module.exports = Assignment;
