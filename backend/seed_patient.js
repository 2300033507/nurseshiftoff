const sequelize = require('./config/database');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');

const seedAlerts = async () => {
    try {
        await sequelize.authenticate();

        let doc = await Doctor.findOne();
        let patient = await Patient.create({
            name: "Mr. Smith",
            age: 78,
            symptoms: "Lethargy, constipation",
            severity: 8,
            department: "Geriatrics",
            roomNumber: "204B",
            diagnosis: "General Decline",
            triageLevel: "Critical",
            admissionStatus: "Admitted",
            missedMedications: 2,
            fallRisk: 'High',
            lastBMHours: 96,
            mealIntake: '<25%',
            isDrowsy: true,
            assignedDoctorId: doc ? doc.id : null
        });

        console.log("Created patient " + patient.name + " with high-risk alerts.");

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

seedAlerts();
