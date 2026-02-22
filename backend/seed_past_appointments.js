const { Sequelize, Op } = require('sequelize');
require('dotenv').config();

const sequelize = require('./config/database');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

async function seedPastAppointments() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB. Finding all patient users...');

        // Find all users who are patients
        const userPatients = await User.findAll({ where: { role: 'Patient' } });

        if (userPatients.length === 0) {
            console.log('No patients found.');
            process.exit(0);
        }

        console.log(`Found ${userPatients.length} patient accounts. Creating past appointments for each...`);

        // Get a default doctor to assign if necessary
        const defaultDoctor = await Doctor.findOne();

        let count = 0;
        for (const user of userPatients) {
            // Find patient profile to match departments or diagnosis
            const patientProfile = await Patient.findOne({ where: { userId: user.id } });

            let pastReason = "Regular Follow-up / Routine check";
            let doctorIdToAssign = defaultDoctor ? defaultDoctor.id : null;

            if (patientProfile) {
                // Contextual reasons
                const dept = (patientProfile.department || '').toLowerCase();
                if (dept === 'cardiology') pastReason = "Initial consultation for acute chest discomfort";
                else if (dept === 'neurology') pastReason = "Migraine & recurring cephalgia review";
                else if (dept === 'pulmonology') pastReason = "Spirometry and COPD checkup";
                else if (dept === 'orthopedics') pastReason = "Arthralgia / Joint effusion examination";
                else pastReason = "General symptom evaluation";

                doctorIdToAssign = patientProfile.assignedDoctorId || doctorIdToAssign;
            }

            // Create an appointment from exactly last week
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - (Math.floor(Math.random() * 14) + 3)); // 3 to 17 days ago

            await Appointment.create({
                reason: pastReason,
                requestedDate: pastDate,
                status: 'Completed', // Setting it as Completed so it's fully past
                patientId: user.id,
                doctorId: doctorIdToAssign
            });

            count++;
        }

        console.log(`\n✅ Successfully added ${count} past, completed appointments to all patients!`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed past appointments:', error);
        process.exit(1);
    }
}

seedPastAppointments();
