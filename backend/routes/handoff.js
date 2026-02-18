const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Handoff = require('../models/Handoff');
const { generateSBAR } = require('../ai/sbarGenerator');

// POST /api/handoff/preview
// Generates SBAR preview from raw notes without saving
router.post('/preview', async (req, res) => {
    try {
        const { patientId, notes } = req.body;

        if (!notes) {
            return res.status(400).json({ error: 'Notes are required' });
        }

        let patient = null;
        if (patientId) {
            patient = await Patient.findByPk(patientId);
        }

        const sbar = generateSBAR(notes, patient);
        res.json({ sbar });

    } catch (error) {
        console.error('Error generating preview:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/handoff
// Save a finalized handoff
router.post('/', async (req, res) => {
    try {
        const { patientId, nurseName, shiftType, shiftNotes, generatedSBAR } = req.body;

        if (!patientId || !nurseName || !shiftNotes) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const handoff = await Handoff.create({
            patientId,
            nurseName,
            shiftType,
            shiftNotes,
            generatedSBAR
        });

        res.status(201).json({ message: 'Handoff saved successfully', handoff });

    } catch (error) {
        console.error('Error saving handoff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/handoff/history/:patientId
// Get past handoffs for a patient
router.get('/history/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const history = await Handoff.findAll({
            where: { patientId },
            order: [['timestamp', 'DESC']]
        });
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
