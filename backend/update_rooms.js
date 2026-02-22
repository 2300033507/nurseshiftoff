const sequelize = require('./config/database');
const Patient = require('./models/Patient');

const updateRooms = async () => {
    try {
        await sequelize.authenticate();

        const patients = await Patient.findAll({
            order: [['id', 'ASC']]
        });

        // Loop through and assign a completely unique room to every single patient in the database to prevent duplicates
        for (let i = 0; i < patients.length; i++) {
            const floor = Math.floor(i / 10) + 1; // e.g. Floor 1, Floor 2
            const roomNum = (i % 10) + 1; // e.g. 1, 2, 3
            // Format: Room 101, 102, 201, 202
            const formattedRoom = `Room ${floor}${roomNum < 10 ? '0' + roomNum : roomNum}`;

            patients[i].roomNumber = formattedRoom;
            await patients[i].save();
            console.log(`Assigned ${patients[i].name} to ${formattedRoom}`);
        }

        console.log("Successfully assigned unique room numbers to all patients.");

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

updateRooms();
