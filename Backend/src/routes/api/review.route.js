const router = require("express").Router();
const reviewController = require("../../controllers/api/review.controller");
const authenticateUser = require("../../middlewares/authenticateUser");

router.get("/:brand_slug", reviewController.getReviewList);
router.get("/all-reviews/:brand_slug", reviewController.getAllReviews);
router.get("/:id", authenticateUser, reviewController.getReviewById);
router.post("/", authenticateUser, reviewController.createReview);
router.patch("/:id", authenticateUser, reviewController.updateReview);
router.delete("/:id", authenticateUser, reviewController.deleteReview);
router.get("/current-user-reactions/:id", authenticateUser, reviewController.fetchCudrrentUserReaction);

module.exports = router;