const mongoose = require("mongoose");
const { blogSchema } = require("./blog");

const bookmarkedBlogsSchema = new mongoose.Schema({
  Blogs: blogSchema,
});
const BookmarkBlogs = mongoose.model("BookmarkedBlogs", bookmarkedBlogsSchema);
module.exports = BookmarkBlogs;
