const router = require("express").Router();
const masterAttributeRoute = require("./api/masterAttribute.route");
const userRoute = require("./api/user.route");
const blogRoute = require("./api/blog.route");
const chatRoute = require("./api/chat.route");
const brandRoute = require("./api/brand.route");
const homeRoute = require("./api/home.route")
const eventRoute = require("./api/event.route");
const brandRegistrationRoute = require("./api/brandRegistration.route");
const authenticateUser = require("../middlewares/authenticateUser")
const reviewRoute = require("../routes/api/review.route");
const reviewReactionsRoute = require("../routes/api/reviewReactions.route");
const seoRoute = require("../routes/api/seo.route");
const authorsRoute = require("../routes/api/authors.route");
const businessGlossaryRoute = require("../routes/api/businessGlossary.route");
// const interestRoute = require("../routes/api/interest.route");

router.use("/master", masterAttributeRoute);
router.use("/auth", userRoute);
router.use("/blog", blogRoute);
router.use("/chat", chatRoute);
router.use("/brand", brandRoute);
router.use("/", homeRoute);
router.use("/event", eventRoute)
router.use("/brand-registration", brandRegistrationRoute);
router.use("/review", reviewRoute);
router.use("/review-react", reviewReactionsRoute);
router.use("/seo", seoRoute);
router.use("/authors", authorsRoute);
router.use("/business-glossary",businessGlossaryRoute);
// router.use("/interest", interestRoute);

module.exports = router;

