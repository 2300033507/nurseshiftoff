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

            await Patient.create({
                name: username,
                age: 0,
                condition: 'Unknown',
                triageLevel: 'Non-Urgent',
                department: targetSpec,
                assignedDoctorId: doctor ? doctor.id : null,
                userId: newUser.id
            });

            if (doctor) {
                try {
                    const sendEmail = require('../utils/emailService');
                    await sendEmail({
                        email: newUser.email,
                        subject: 'Your Care Team Assignment - AI CareFlow',
                        message: `Welcome to AI CareFlow, ${username}!\n\nBased on your department selection (${targetSpec}), you have been assigned to:\n\nDr. ${doctor.name}\nSpecialization: ${doctor.specialization}\n\nYou can view your care team details in the Patient Portal.`
                    });
                } catch (emailErr) {
                    console.error('Failed to send assignment email:', emailErr);
                    // Continue registration even if email fails
                }
            }
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
