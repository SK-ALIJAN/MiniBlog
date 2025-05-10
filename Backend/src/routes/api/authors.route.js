const router = require("express").Router();
const authorsController = require("../../controllers/api/authors.controller");
router.get("/blog-list/:slug", authorsController.fetchAuthorsBlogs);
module.exports = router;