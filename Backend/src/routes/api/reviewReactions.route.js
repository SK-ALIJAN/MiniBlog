const router = require("express").Router();
const reviewReactionsController = require("../../controllers/api/reviewReactions.controller");
const authenticateUser = require("../../middlewares/authenticateUser");

router.post("/", authenticateUser, reviewReactionsController.addOrUpdate);

module.exports = router;