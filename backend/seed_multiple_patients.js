const sequelize = require('./config/database');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');

const seedPatients = async () => {
    try {
        await sequelize.authenticate();

        // Find general doctor
        let doc1 = await Doctor.findOne({ where: { specialization: 'General' } });
        let doc2 = await Doctor.findOne({ where: { specialization: 'Cardiology' } });
        let doc3 = await Doctor.findOne({ where: { specialization: 'Emergency' } });

        // Create Alice (Missed meds, stable otherwise)
        await Patient.create({
            name: "VALLANGI RAKESH",
            age: 22,
            symptoms: "Mild hypertension, forgets medication",
            severity: 4,
            department: "General",
            roomNumber: "102A",
            diagnosis: "Hypertension Management",
            triageLevel: "Moderate",
            admissionStatus: "Admitted",
            missedMedications: 3, // High risk flag
            fallRisk: 'Low',
            lastBMHours: 24,
            mealIntake: 'Normal',
            isDrowsy: false,
            assignedDoctorId: doc1 ? doc1.id : null
        });

        // Create Bob (High Fall Risk and Drowsy)
        await Patient.create({
            name: "HASWNATH KUMAR",
            age: 50,
            symptoms: "Confusion, weakness",
            severity: 7,
            department: "Emergency",
            roomNumber: "ER-04",
            diagnosis: "Dehydration, UTI",
            triageLevel: "Critical",
            admissionStatus: "Admitted",
            missedMedications: 0,
            fallRisk: 'High', // High risk flag
            lastBMHours: 48,
            mealIntake: 'Normal',
            isDrowsy: true, // High risk flag
            assignedDoctorId: doc3 ? doc3.id : null
        });

        // Create Carol (No issues, discharging soon)
        await Patient.create({
            name: "MADHAVA SAI",
            age: 45,
            symptoms: "Recovering from minor surgery",
            severity: 2,
            department: "General",
            roomNumber: "305",
            diagnosis: "Post-op Observation",
            triageLevel: "Low",
            admissionStatus: "Admitted",
            missedMedications: 0,
            fallRisk: 'Low',
            lastBMHours: 12,
            mealIntake: 'Normal',
            isDrowsy: false,
            assignedDoctorId: doc1 ? doc1.id : null
        });

        // Create David (No BM + Poor Meal Intake)
        await Patient.create({
            name: "SRINIVAS RAO",
            age: 71,
            symptoms: "Abdominal pain, nausea",
            severity: 6,
            department: "General",
            roomNumber: "210B",
            diagnosis: "Bowel Obstruction Suspected",
            triageLevel: "Moderate",
            admissionStatus: "Admitted",
            missedMedications: 0,
            fallRisk: 'Medium',
            lastBMHours: 120, // High risk flag
            mealIntake: '<25%', // High risk flag
            isDrowsy: false,
            assignedDoctorId: doc1 ? doc1.id : null
        });

        console.log("Varied patient records created successfully.");

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

seedPatients();
