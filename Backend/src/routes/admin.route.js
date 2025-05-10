const router = require("express").Router();
const authRoute = require("./admin/auth.route");
const homeRoute = require("./admin/home.router");
const blogRoute = require("./admin/blog.route");
const authenticateUser = require("../middlewares/authenticateUser");


router.get("/", homeRoute);
router.use("/auth", authRoute);
router.use("/blog", authenticateUser, blogRoute);

module.exports = router;
