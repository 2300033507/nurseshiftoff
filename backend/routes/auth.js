const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'Patient'
        });

        if (role === 'Patient') {
            const Patient = require('../models/Patient');
            const Doctor = require('../models/Doctor');
            // Try to find a doctor with matching specialization
            // default to 'General' if department not provided
            const targetSpec = req.body.department || 'General';

            const doctor = await Doctor.findOne({
                where: { specialization: targetSpec }
            });

            // Generate dynamic clinical notes for new patients
            const clinicalCases = [
                { symptoms: 'Patient reports acute chest discomfort radiating to left arm.', diagnosis: 'Suspected Angina / Tachycardia', severity: 7, triageLevel: 'Moderate' },
                { symptoms: 'Reports severe arthralgia and limited range of motion. Joint effusion present.', diagnosis: 'Acute monoarthritis', severity: 5, triageLevel: 'Low' },
                { symptoms: 'Patient exhibits persistent cephalgia accompanied by photophobia.', diagnosis: 'Migraine Exacerbation', severity: 6, triageLevel: 'Moderate' },
                { symptoms: 'Shortness of breath and mild hypoxemia on room air. Expiratory wheezes.', diagnosis: 'Acute exacerbation of COPD', severity: 8, triageLevel: 'Critical' },
                { symptoms: 'Mild erythema and edema in the lower left extremity.', diagnosis: 'Peripheral edema', severity: 3, triageLevel: 'Low' }
            ];
            const randomCase = clinicalCases[Math.floor(Math.random() * clinicalCases.length)];

            await Patient.create({
                name: username,
                age: Math.floor(Math.random() * 40) + 20, // Random age between 20-60
                symptoms: randomCase.symptoms,
                severity: randomCase.severity,
                diagnosis: randomCase.diagnosis,
                triageLevel: randomCase.triageLevel,
                department: targetSpec,
                assignedDoctorId: doctor ? doctor.id : null,
                userId: newUser.id
            });
        }

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // specific check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/auth/forgot-password
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');
const { Op } = require('sequelize');

router.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            return res.status(500).json({ error: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/auth/reset-password/:resetToken
router.post('/reset-password/:resetToken', async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

        const user = await User.findOne({
            where: {
                resetPasswordToken,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ success: true, data: 'Password reset success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
