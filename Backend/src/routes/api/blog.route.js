const router = require("express").Router();
const blogController = require("../../controllers/api/blog.controller");
const authenticateUser = require("../../middlewares/authenticateUser");

router.get("/", blogController.fetchBlogs);
router.get("/list",blogController.fetchBlogsList);
router.get("/master-attribute-value-list", blogController.masterAttributeValueList);
router.get("/fetch-blog/:slug", blogController.fetchBlogData);
router.get("/related-blogs/:slug", blogController.fetchRelatedBlogs);
router.get("/all-category", blogController.fetchCategory);
router.post("/get-blogs-as-per-category", blogController.getCategoryWiseBlogs)

router.get("/blog-comments/:blog_slug", blogController.fetchBlogCommentsBySlug)

router.post("/comment", authenticateUser, blogController.createComment)

module.exports = router;