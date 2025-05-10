const router = require("express").Router();
const registerController = require("../../controllers/api/brandRegistration.controiller");

router.post("/", registerController.register);
router.get("/questions", registerController.fetchQuestionData);

module.exports = router;