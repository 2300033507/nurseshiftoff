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
// POST /api/handoff/email
// Sends generated SBAR via email
router.post('/email', async (req, res) => {
    try {
        const { email, patientName, sbar } = req.body;
        if (!email || !sbar) {
            return res.status(400).json({ error: 'Email and SBAR are required' });
        }

        const sendEmail = require('../utils/emailService');

        const htmlContent = `
            <h2>Shift Handoff Report for ${patientName || 'Patient'}</h2>
            <h3>Situation</h3>
            <p>${sbar.situation || 'N/A'}</p>
            <h3>Background</h3>
            <p>${sbar.background || 'N/A'}</p>
            <h3>Assessment</h3>
            <p>${sbar.assessment || 'N/A'}</p>
            <h3>Recommendation</h3>
            <p>${sbar.recommendation || 'N/A'}</p>
        `;

        await sendEmail({
            email,
            subject: `[Handoff Report] Patient: ${patientName || 'Patient'}`,
            html: htmlContent
        });

        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

module.exports = router;
