const express = require("express");
const blogRouter = express.Router();
const multer = require("multer");
const blogController = require("../controllers/blog");
const { auth } = require("../middleware/auth");
const upload = require("../utils/multer");
const { Blog } = require("../models/blog");
const { paginatedResponse } = require("../middleware/paginated_reposnse");

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
blogRouter.get("/with-limit",paginatedResponse(Blog),(req,res)=>{
  res.status(200).json(res.paginatedResponse)
})

blogRouter.post("/add-to-blog-a-read/:blogId",auth,blogController.add_to_blog_a_read)
module.exports = blogRouter;
