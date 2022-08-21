const express = require("express");
const blogRouter = express.Router();
const multer = require("multer");
const blogController = require("../controllers/blog");
const { auth } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg"
  )
    cb(null, true);
  else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
    fileFilter: fileFilter,
  },
});
blogRouter.post(
  "/add-blog",
  auth,
  upload.single("blogImage"),
  blogController.add_blog
);
blogRouter.get("/blog-timeline",auth,blogController.get_all_blog_for_timeline)
blogRouter.get("/blogs-for-specific-category/:categoryName",auth,blogController.get_blogs_for_specific_category);
blogRouter.post("/search_for_blog/:blogTitle",auth,blogController.search_for_blogs)
blogRouter.get("/get-all-my-blogs",auth,blogController.get_all_my_blogs)
blogRouter.post("/get-blogs-for-specific-user/:userId",auth,blogController.get_blogs_for_specific_user)
blogRouter.get("/",blogController.get__all_blogs)
blogRouter.post("/add-to-blog-a-read/:blogId",auth,blogController.add_to_blog_a_read)
module.exports = blogRouter;
