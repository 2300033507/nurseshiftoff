const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
require('dotenv').config();

const sequelize = require('./config/database');

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Rakesh - Cardiology
        const hq1 = await bcrypt.hash('password123', 10);
        const [rakeshUser] = await User.findOrCreate({
            where: { email: 'rakesh123@gmail.com' },
            defaults: {
                username: 'rakesh',
                password: hq1,
                role: 'Patient'
            }
        });

        // Vinay - Orthopedics
        const hq2 = await bcrypt.hash('password123', 10);
        const [vinayUser] = await User.findOrCreate({
            where: { email: 'vinay123@gmail.com' },
            defaults: {
                username: 'vinay',
                password: hq2,
                role: 'Patient'
            }
        });

        // Get some doctors
        const cardDoc = await Doctor.findOne({ where: { specialization: 'Cardiology' } });
        const orthoDoc = await Doctor.findOne({ where: { specialization: 'Orthopedics' } });

        // Ensure Patients exist and update them
        await Patient.findOrCreate({ where: { userId: rakeshUser.id }, defaults: { name: 'rakesh', age: 35, symptoms: 'chest pain', severity: 5, department: 'Cardiology' } });
        await Patient.update({
            symptoms: 'Severe chest tightness and shortness of breath',
            department: 'Cardiology',
            diagnosis: 'Suspected Angina',
            assignedDoctorId: cardDoc ? cardDoc.id : null,
            triageLevel: 'Moderate',
            missedMedications: 1,
            isDrowsy: false
        }, { where: { userId: rakeshUser.id } });

        await Patient.findOrCreate({ where: { userId: vinayUser.id }, defaults: { name: 'vinay', age: 42, symptoms: 'joint pain', severity: 4, department: 'Orthopedics' } });
        await Patient.update({
            symptoms: 'Severe right knee joint pain and swelling',
            department: 'Orthopedics',
            diagnosis: 'Acute monoarthritis',
            assignedDoctorId: orthoDoc ? orthoDoc.id : null,
            triageLevel: 'Moderate',
            missedMedications: 0,
            fallRisk: 'High'
        }, { where: { userId: vinayUser.id } });

        console.log('Successfully seeded Rakesh and Vinay with different clinical cases!');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

seed();
