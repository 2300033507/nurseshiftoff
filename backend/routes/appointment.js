const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// POST /api/appointment
// Create a new appointment request
router.post('/', async (req, res) => {
    try {
        const { reason, requestedDate, doctorId } = req.body;
        const patientId = req.user.id; // From authMiddleware

        const appointment = await Appointment.create({
            patientId,
            doctorId: doctorId || null,
            reason,
            requestedDate,
            status: 'Pending'
        });

        res.status(201).json(appointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/appointment
// List all appointments (For Doctor/Nurse)
router.get('/', async (req, res) => {
    try {
        // In a real app, restrict based on role
        const appointments = await Appointment.findAll({
            include: [
                { model: User, as: 'Patient', attributes: ['username', 'email'] },
                { model: Doctor, attributes: ['name', 'specialization'] }
            ],
            order: [['requestedDate', 'ASC']]
        });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/appointment/my-appointments
// List appointments for the logged-in patient
router.get('/my-appointments', async (req, res) => {
    try {
        const patientId = req.user.id;
        const appointments = await Appointment.findAll({
            where: { patientId },
            include: [
                { model: Doctor, attributes: ['name', 'specialization'] }
            ],
            order: [['requestedDate', 'ASC']]
        });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching user appointments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/appointment/:id/status
// Update status (Approve/Reject)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment.status = status;
        await appointment.save();

        res.json(appointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
