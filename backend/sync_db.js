const sequelize = require('./config/database');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Assignment = require('./models/Assignment');
const Handoff = require('./models/Handoff');

const sync = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        console.error('Error Details:', JSON.stringify(error, null, 2));
    } finally {
        await sequelize.close();
    }
};

sync();
