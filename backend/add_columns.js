const sequelize = require('./config/database');

const addColumns = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.query("ALTER TABLE Patients ADD COLUMN missedMedications INTEGER DEFAULT 0;");
        await sequelize.query("ALTER TABLE Patients ADD COLUMN fallRisk VARCHAR(255) DEFAULT 'Low';");
        await sequelize.query("ALTER TABLE Patients ADD COLUMN lastBMHours INTEGER DEFAULT 0;");
        await sequelize.query("ALTER TABLE Patients ADD COLUMN mealIntake VARCHAR(255) DEFAULT 'Normal';");
        await sequelize.query("ALTER TABLE Patients ADD COLUMN isDrowsy BOOLEAN DEFAULT 0;");
        console.log("Columns added successfully");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

addColumns();
