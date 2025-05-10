const router = require("express").Router();
const blogController = require("../../controllers/admin/blog.controller");

router.get("/", blogController.fetchBlogs);
router.post("/", blogController.addBlogs);
router.patch("/", blogController.updateBlog);
router.patch("/toggle-status", blogController.toggleBlogStatus);
router.delete("/:id", blogController.deleteBlog);
router.get("/fetch-blog/:slug", blogController.fetchBlogData);


module.exports = router;
