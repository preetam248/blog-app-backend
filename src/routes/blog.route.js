const Router = require("express");
const isAuthenticated = require("../middlewares/auth.middleware");
const { createBlog, allBlogs, deleteBlog, userBlogs } = require("../controllers/blog.controller");
const upload = require("../middlewares/multer.middleware");
const router = Router();

router.post("/create", isAuthenticated, upload.single("image"), createBlog);
router.get("/all", allBlogs);
router.delete("/delete/:id", isAuthenticated, deleteBlog);
router.get("/user/blogs", isAuthenticated, userBlogs);

module.exports = router;