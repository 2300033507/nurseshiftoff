const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const User = require('./models/User');

const seedSpecificUser = async () => {
    try {
        await sequelize.authenticate();

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        // Doctor Account
        try {
            const user = await User.create({
                username: 'Dr. Smith',
                email: 'd.smith@hospital.com',
                password: password,
                role: 'Doctor'
            });
            console.log(`Successfully created user: ${user.email}`);
        } catch (e) {
            console.log(`dr error: ${e.message}`);
            // if exists, it's fine.
        }

        // Patient Account
        try {
            const pUser = await User.create({
                username: 'Mr. Smith',
                email: 'smith@patient.com',
                password: password,
                role: 'Patient'
            });
            console.log(`Successfully created user: ${pUser.email}`);

            // link patient record
            const Patient = require('./models/Patient');
            const pt = await Patient.findOne({ where: { name: 'Mr. Smith' } });
            if (pt) {
                pt.userId = pUser.id;
                await pt.save();
            }
        } catch (e) {
            console.log(`pt error: ${e.message}`);
        }

        // Nurse Account
        try {
            const nUser = await User.create({
                username: 'Nurse Vicky',
                email: 'nurse@hospital.com',
                password: password,
                role: 'Nurse'
            });
            console.log(`Successfully created user: ${nUser.email}`);
        } catch (e) {
            console.log(`nr error: ${e.message}`);
        }

    } catch (e) {
        console.error("fatal:", e.message);
    } finally {
        process.exit(0);
    }
};

seedSpecificUser();
