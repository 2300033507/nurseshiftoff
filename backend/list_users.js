const sequelize = require('./config/database');
const fs = require('fs');
const listUsers = async () => {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query("SELECT id, username, email, role FROM `Users`;");
        fs.writeFileSync('users.json', JSON.stringify(results, null, 2));
    } catch (e) {
        console.error("fatal:", e.message);
    } finally {
        process.exit(0);
    }
};

listUsers();
