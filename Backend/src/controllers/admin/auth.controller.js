const httpStatus = require("http-status");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const Admin = require("../../models/admin.model");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("../../utils/token");

exports.login = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({
    attributes: ["id", "email", "password", "status","role_id","user_name","admin_name","profile_image"],
    where: { email },
  });

  if (!admin) throw createHttpError(httpStatus.NOT_FOUND, "Admin not found");

  if (admin.status === 0)
    throw createHttpError(httpStatus.FORBIDDEN, "Account is inactive!");

  const isValid = await bcrypt.compare(password, admin.password);

  if (!isValid)
    throw createHttpError(
      httpStatus.FORBIDDEN,
      "Invalid email or password, try again!!"
    );

  delete admin.dataValues.password;
  delete admin.dataValues.status;

  const token = await jwt.genToken(admin.dataValues);
  // delete admin.dataValues.id;

  await admin.update({ last_login: new Date() });

  res.status(httpStatus.OK).json({
    success: true,
    data: admin,
    token,
    message: "Successfully logged in",
  });
});
