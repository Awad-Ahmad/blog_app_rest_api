const mongoose = require("mongoose");
const { blogSchema } = require("./blog");

const bookmarkedBlogsSchema = new mongoose.Schema({
  userId:{
    type:String,
  },
  Blogs: blogSchema,
});
const BookmarkBlogs = mongoose.model("BookmarkedBlogs", bookmarkedBlogsSchema);
module.exports = BookmarkBlogs;
