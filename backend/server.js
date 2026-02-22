const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const patientRoutes = require('./routes/patient');
const handoffRoutes = require('./routes/handoff');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointment');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Assignment = require('./models/Assignment');
const Handoff = require('./models/Handoff');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const authMiddleware = require('./middleware/authMiddleware');

// Associations
Patient.belongsTo(User, { foreignKey: 'userId' });
Doctor.hasMany(Patient, { foreignKey: 'assignedDoctorId' });
Patient.belongsTo(Doctor, { foreignKey: 'assignedDoctorId' });

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patient', authMiddleware, patientRoutes);
app.use('/api/handoff', authMiddleware, handoffRoutes);
app.use('/api/appointment', authMiddleware, appointmentRoutes);

// Seed Doctors if empty
const seedDoctors = async () => {
    try {
        const count = await Doctor.count();
        if (count === 0) {
            const doctors = [
                { name: 'Dr. Smith', specialization: 'General', currentLoad: 0, maxLoad: 10 },
                { name: 'Dr. Jones', specialization: 'Cardiology', currentLoad: 0, maxLoad: 8 },
                { name: 'Dr. Williams', specialization: 'Emergency', currentLoad: 0, maxLoad: 15 },
                { name: 'Dr. Brown', specialization: 'Neurology', currentLoad: 0, maxLoad: 5 },
                { name: 'Dr. Davis', specialization: 'Pediatrics', currentLoad: 0, maxLoad: 12 }
            ];
            await Doctor.bulkCreate(doctors);
            console.log('Doctors seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding doctors:', error);
    }
};

// Start Server & Sync DB
sequelize.sync() // Update schema without dropping data
    .then(() => {
        console.log('Database synced');
        seedDoctors();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });
