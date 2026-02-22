const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = require('./config/database');
const Patient = require('./models/Patient');

async function updatePatients() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB. Fetching all patients...');

        const patients = await Patient.findAll();

        if (patients.length === 0) {
            console.log('No patients found in the database to update.');
            process.exit(0);
        }

        console.log(`Found ${patients.length} patients. Updating their clinical notes randomly...`);

        const clinicalCases = [
            { symptoms: 'Patient reports acute chest discomfort radiating to left arm.', diagnosis: 'Suspected Angina / Tachycardia', severity: 7, triageLevel: 'Moderate' },
            { symptoms: 'Reports severe arthralgia and limited range of motion. Joint effusion present.', diagnosis: 'Acute monoarthritis', severity: 5, triageLevel: 'Low' },
            { symptoms: 'Patient exhibits persistent cephalgia accompanied by photophobia.', diagnosis: 'Migraine Exacerbation', severity: 6, triageLevel: 'Moderate' },
            { symptoms: 'Shortness of breath and mild hypoxemia on room air. Expiratory wheezes.', diagnosis: 'Acute exacerbation of COPD', severity: 8, triageLevel: 'Critical' },
            { symptoms: 'Mild erythema and edema in the lower left extremity.', diagnosis: 'Peripheral edema', severity: 3, triageLevel: 'Low' },
            { symptoms: 'Nausea, uncontrolled vomiting, and dizziness on standing.', diagnosis: 'Severe orthostatic hypotension', severity: 6, triageLevel: 'Moderate' },
            { symptoms: 'Fever of 102.4, productive cough, and fatigue.', diagnosis: 'Community-acquired pneumonia', severity: 5, triageLevel: 'Low' }
        ];

        for (let i = 0; i < patients.length; i++) {
            const patient = patients[i];
            const randomCase = clinicalCases[Math.floor(Math.random() * clinicalCases.length)];

            await patient.update({
                symptoms: randomCase.symptoms,
                diagnosis: randomCase.diagnosis,
                triageLevel: randomCase.triageLevel,
                severity: randomCase.severity
            });
            console.log(`Updated patient ${patient.name} (${patient.id}) -> ${randomCase.diagnosis}`);
        }

        console.log('\n✅ Successfully updated all existing patients with unique clinical data! (No emails sent)');
        process.exit(0);
    } catch (error) {
        console.error('Unable to update patients:', error);
        process.exit(1);
    }
}

updatePatients();
