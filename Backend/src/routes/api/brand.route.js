const router = require("express").Router();
const brandController = require("../../controllers/api/brand.controller");
router.get("/get-brand-details/:slug", brandController.fetchBrandBySlug);
router.get("/", brandController.fetchBrands);
router.get("/list", brandController.fetchBrandLists);
router.get("/master-attribute-value-list", brandController.masterAttributeValueList);
router.get("/brand-related-blog/:slug", brandController.fetchBrandRelatedBlog);
router.get("/master-attribute-value-type-list", brandController.masterAttributeValueTypeList);
router.get("/blogs-list", brandController.fetchBrandlistingBlog);
router.get("/blogs/:slug", brandController.fetchBrandlistingBlogDetails);
router.get("/related-blogs/:slug", brandController.fetchBrandlistingBlogRelated);
router.get("/sportLightBlogs/:slug", brandController.fetchBrandSportLight);

module.exports = router;