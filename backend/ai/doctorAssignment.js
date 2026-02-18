const Doctor = require('../models/Doctor');
const { Op } = require('sequelize');

const assignDoctor = async (department, severity) => {
    try {
        // Find doctors in the relevant department/specialization with available capacity
        let whereClause = {
            currentLoad: { [Op.lt]: 100 } // Safety check, logic below handles maxLoad
        };

        if (department) {
            whereClause.specialization = { [Op.like]: `%${department}%` };
        }

        let doctors = await Doctor.findAll({ where: whereClause });

        if (doctors.length === 0) {
            // Fallback to General if specific specialist not found
            doctors = await Doctor.findAll({ where: { specialization: 'General' } });
            if (doctors.length === 0) return null;
        }

        // Sort doctors by current load percentage
        // Prioritize lower load
        // Note: In Sequelize, we do this in JS since it's a computed value (current/max)
        doctors.sort((a, b) => (a.currentLoad / a.maxLoad) - (b.currentLoad / b.maxLoad));

        // Return the best match
        // Check if load is below maxLoad
        for (const doc of doctors) {
            if (doc.currentLoad < doc.maxLoad) {
                return doc;
            }
        }

        return null; // No available doctors

    } catch (error) {
        console.error('Error assigning doctor:', error);
        return null;
    }
};

module.exports = { assignDoctor };
