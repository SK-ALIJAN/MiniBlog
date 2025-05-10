const router = require("express").Router();
const adminRoute = require("./admin.route")
const apiRoute = require("./api.route")

router.get("/", (req, res) => {
    res.redirect("/admin")
});

router.get("/admin", (req, res) => {
    res.redirect("/admin")
});

router.use("/admin", adminRoute);
router.use("/api", apiRoute);

module.exports = router;
