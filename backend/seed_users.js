const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const User = require('./models/User');
const Patient = require('./models/Patient');

const seedUsers = async () => {
    try {
        await sequelize.authenticate();

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        try {
            const usersToCreate = [
                { username: 'Nurse Vicky1', email: 'vicky@hospital.com', password: password, role: 'Nurse' },
                { username: 'Dr. Smith1', email: 'dsmith@hospital.com', password: password, role: 'Doctor' },
                { username: 'Mr. Smith1', email: 'd=smith', password: password, role: 'Patient' } // 'd=smith account'
            ];

            for (const u of usersToCreate) {
                try {
                    await User.create(u);
                    console.log(`Created user ${u.email}`);
                } catch (eu) {
                    console.log(`Failed to create ${u.email}: ${eu.message}`);
                }
            }
        } catch (dbErr) {
            console.error("DB Error:", dbErr);
        }
    } catch (e) {
        console.error(e.message);
    } finally {
        process.exit(0);
    }
};

seedUsers();
