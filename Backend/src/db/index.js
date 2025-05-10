const config = require('../config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword.toString(), {
    host: config.dbHost,
    port: parseInt(config.dbPort),
    dialect: "postgres",
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected Successfully!");
        await sequelize.sync({ alter: true });
        const seedMasterData = require("./seeders/seederIndex");
        await seedMasterData();
        console.log("Tables Created Successfully!");
    } catch (error) {
        console.log("========== DB Error!!! ==========", error.message, error);
    }
})();

module.exports = sequelize;
