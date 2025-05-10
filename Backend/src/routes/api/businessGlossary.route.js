const router = require("express").Router();
const businessGlossaryController = require("../../controllers/api/businessglossary.controller");
router.get("/", businessGlossaryController.fetchBgs);
module.exports = router;