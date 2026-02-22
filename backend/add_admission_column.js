const sequelize = require('./config/database');

const addColumn = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        // Check if column exists or add it
        try {
            await sequelize.query(`
                ALTER TABLE Patients 
                ADD COLUMN admissionStatus ENUM('Pending', 'Admitted', 'Discharged') 
                DEFAULT 'Pending';
            `);
            console.log('Column added successfully.');
        } catch (err) {
            console.log('Column might already exist or error:', err.message);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

addColumn();
