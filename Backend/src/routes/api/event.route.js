const router = require("express").Router();
const eventController = require("../../controllers/api/event.controller.js");
const authenticateUser = require("../../middlewares/authenticateUser.js");

router.post("/upcoming-events", eventController.fetchEvents);
router.post("/past-events", eventController.fetchPastEvents);
router.post("/popular-events", eventController.PopularEvents);
router.get("/event-details/:slug", eventController.fetchEventByslug);
router.post("/mark-interest", authenticateUser, eventController.toggleInterest);
// router.get("/:event_id", eventController.getInterestedByUser);

module.exports = router;
