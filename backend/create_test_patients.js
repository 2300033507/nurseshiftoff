const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sequelize = require('./config/database');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');

async function createPatients() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const neuroDoc = await Doctor.findOne({ where: { specialization: 'Neurology' } });
        const pulmoDoc = await Doctor.findOne({ where: { specialization: 'Pulmonology' } });

        const patientsData = [
            {
                username: 'sneha',
                email: 'sneha@gmail.com',
                password: 'password123',
                patientDetails: {
                    name: 'sneha',
                    age: 29,
                    symptoms: 'Patient exhibits persistent cephalgia accompanied by photophobia. Neurological exam reveals no focal deficits.',
                    department: 'Neurology',
                    diagnosis: 'Migraine Exacerbation',
                    triageLevel: 'Low',
                    assignedDoctorId: neuroDoc ? neuroDoc.id : null,
                    severity: 6,
                    fallRisk: 'Low'
                }
            },
            {
                username: 'arjun',
                email: 'arjun@gmail.com',
                password: 'password123',
                patientDetails: {
                    name: 'arjun',
                    age: 55,
                    symptoms: 'Presents with shortness of breath and mild hypoxemia on room air (SpO2 91%). Auscultation reveals bilateral expiratory wheezes.',
                    department: 'Pulmonology',
                    diagnosis: 'Acute exacerbation of COPD',
                    triageLevel: 'Critical',
                    assignedDoctorId: pulmoDoc ? pulmoDoc.id : null,
                    severity: 8,
                    fallRisk: 'Medium'
                }
            }
        ];

        for (const data of patientsData) {
            // Check if user exists
            let user = await User.findOne({ where: { username: data.username } });
            if (!user) {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                user = await User.create({
                    username: data.username,
                    email: data.email,
                    password: hashedPassword,
                    role: 'Patient'
                });
                console.log(`Created User: ${data.username}`);
            } else {
                console.log(`User ${data.username} already exists`);
            }

            // Check if patient profile exists
            let patient = await Patient.findOne({ where: { userId: user.id } });
            if (!patient) {
                await Patient.create({
                    ...data.patientDetails,
                    userId: user.id
                });
                console.log(`Created Patient Profile: ${data.patientDetails.name} (${data.patientDetails.department})`);
            } else {
                await patient.update(data.patientDetails);
                console.log(`Updated Patient Profile: ${data.patientDetails.name} (${data.patientDetails.department})`);
            }
        }

        console.log('\n✅ Successfully created/updated patients "sneha" and "arjun" with @gmail emails and distinct clinical notes.');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

createPatients();
