const sequelize = require('./config/database');
const Patient = require('./models/Patient');

const seedAlerts = async () => {
    try {
        await sequelize.authenticate();

        // Find a patient to update, preferably admitted. If none, just pick the first.
        let patient = await Patient.findOne({ where: { admissionStatus: 'Admitted' } });
        if (!patient) {
            patient = await Patient.findOne();
        }

        if (patient) {
            patient.missedMedications = 2;
            patient.fallRisk = 'High';
            patient.lastBMHours = 96;
            patient.mealIntake = '<25%';
            patient.isDrowsy = true;
            await patient.save();
            console.log("Updated patient " + patient.name + " with high-risk alerts.");
        } else {
            console.log("No patients found to update.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

seedAlerts();
