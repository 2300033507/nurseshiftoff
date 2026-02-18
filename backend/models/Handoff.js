const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const Handoff = sequelize.define('Handoff', {
    nurseName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shiftType: {
        type: DataTypes.ENUM('Day', 'Night'),
        allowNull: false
    },
    shiftNotes: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    generatedSBAR: {
        type: DataTypes.JSON, // Stores the structured SBAR object
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Association
Handoff.belongsTo(Patient, { foreignKey: 'patientId' });
Patient.hasMany(Handoff, { foreignKey: 'patientId' });

module.exports = Handoff;
