const sequelize = require("../../db");
const Admin = require("../../models/admin.model");

const seedAdminMaster = async () => {
  const AdminData = [
    {
      id: 1,
      role_id: 1,
      user_name: "admin@gmail.com",
      password: "$2b$10$qj6MXordk4PfWsNtPogCYetrQmqqsDMn0XqWRCUYbpDY0W2Y.aXwW",
      admin_name: "Admin User",
      email: "admin@gmail.com",
      mobile: 1234567890,
      profile_image: "profile_image_url",
      address: "Admin Headquarters, Admin City",
      status: "active",
      created_by: 0,
      updated_by: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  try {
    await Admin.bulkCreate(AdminData, {
      updateOnDuplicate: [
        "role_id",
        "user_name",
        "password",
        "admin_name",
        "email",
        "mobile",
        "profile_image",
        "address",
        "status",
        "created_by",
        "updated_by",
      ],
    });
    console.log("Admin data seeded successfully.");
  } catch (error) {
    console.error("Error seeding admin data:", error);
  }
};

module.exports = seedAdminMaster;
