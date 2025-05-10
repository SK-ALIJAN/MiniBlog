const router = require("express").Router();
const seoController = require("../../controllers/api/seo.controller");

router.get("/blog/:slug", seoController.fetchBlogSeoData);
router.get("/brand/:slug", seoController.fetchBrandSeoData)
router.get("/event/:slug", seoController.fetchEventSeoData)

module.exports = router;