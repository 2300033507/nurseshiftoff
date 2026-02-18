const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Assignment = require('../models/Assignment');
const Doctor = require('../models/Doctor');
const { assessSeverity } = require('../ai/triage');
const { assignDoctor } = require('../ai/doctorAssignment');

// GET /api/patient
// List all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.findAll({
            include: [{ model: Doctor, attributes: ['name', 'specialization'] }]
        });
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/patient/me
// Get current logged-in patient details
router.get('/me', async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const patient = await Patient.findOne({
            where: { userId: req.user.id },
            include: [{ model: Doctor, attributes: ['name', 'specialization'] }]
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient profile not found' });
        }

        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/patient
router.post('/', async (req, res) => {
    try {
        const { name, age, symptoms, severity, department } = req.body;

        // 1. Validation
        if (!name || !age || !symptoms || !severity || !department) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 2. AI Triage
        const triageLevel = assessSeverity(symptoms, severity);

        // 3. AI Doctor Assignment
        let assignedDoc = await assignDoctor(department, severity);

        // 4. Create Patient Record
        const newPatient = await Patient.create({
            name,
            age,
            symptoms,
            severity,
            department,
            triageLevel,
            assignedDoctorId: assignedDoc ? assignedDoc.id : null
        });

        // 5. Create Assignment Record & Update Doctor Load
        if (assignedDoc) {
            await Assignment.create({
                patientId: newPatient.id,
                doctorId: assignedDoc.id,
                status: 'Active'
            });

            // Increment load
            await assignedDoc.increment('currentLoad', { by: 1 });
        }

        // 6. Return Response
        res.status(201).json({
            message: 'Patient processed successfully',
            patientId: newPatient.id,
            triageLevel: triageLevel,
            assignedDoctor: assignedDoc ? {
                name: assignedDoc.name,
                specialization: assignedDoc.specialization
            } : 'Pending Assignment'
        });

    } catch (error) {
        console.error('Error processing patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
