const seedAdminMaster = require("./adminSeeders");

const seedMasterData = async () => {
  await seedAdminMaster();
};

module.exports = seedMasterData;
