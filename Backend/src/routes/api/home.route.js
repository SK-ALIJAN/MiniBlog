const router = require("express").Router();
const homeController = require("../../controllers/api/home.controller");
const validate = require("../../middlewares/validate");
const newsletterSchema = require("../../validations/newsletter.validation");

router.get("/fetch-events", homeController.fetchEvents);
router.get("/fetch-knowledge", homeController.fetchKnowledgeBase);
router.get("/fetch-story", homeController.fetchStoryStream);
router.get("/fetch-hot-takes", homeController.fetchHotTakes);
router.get("/fetch-byte", homeController.fetchBytes);
router.get("/fetch-spot-light", homeController.fetchSpotLight);
router.post("/newsletter", validate(newsletterSchema), homeController.subscribeNewsletter);
router.post("/newsletter/unsubscribe", validate(newsletterSchema), homeController.unsubscribeNewsletter);

module.exports = router;