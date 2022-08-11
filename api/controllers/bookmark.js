const { Blog } = require("../models/blog");
const BookmarkBlogs = require("../models/bookmarkedBlogs");
exports.add_bookmark = (req, res) => {
const blogs=  Blog.find({ _id: req.params.blogId })
    .then(async (blog) => {

      if (blog.length >= 1) {
      
         Blog.findByIdAndUpdate(req.params.blogId,{isBookMarked:true}, { new: true }).then(async (value)=>{
          console.log(value)
          const isBookMarked =await BookmarkBlogs.find({
            "Blogs._id":req.params.blogId
           })
           if(isBookMarked.length>=1)
           {
            BookmarkBlogs.deleteOne({"blogs._id":req.params.blogId}).then((value)=>{
              Blog.findByIdAndUpdate(req.params.blogId,{isBookMarked:false}, { new: true }).then((value=>{  res.status(200).json({
                message:"you  un-bookmarked this blog"
              })})).catch((error)=>{
                res.status(500).json({
                  error:error.message
                })
              })

            
            }).catch((error)=>{
              res.status(500).json({error:error.message})
            })
             
           }
           else
           {
             const bookmark = new BookmarkBlogs({
               Blogs: value,
             })
               .save()
               .then((value) => {
                 res.status(200).json({
                   message: "the bookmark is added successfully",
                 });
               })
               .catch((error) => {
                 res.status(500).json({
                   error: error.message,
                 });
               });
              }
             

        }).catch((error)=>{
          res.status(500).json({
            error:error.message
          })
        })
   
      } else {
        res.status(404).json({
          message: "the blog is not found ",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.delete_bookmark = (req, res) => {
  BookmarkBlogs.deleteOne({ _id: req.params.bookmarkId })
    .then((value) => {
      console.log(value);
      if (value.deletedCount > 0) {
        res.status(200).json({
          message: "the bookmark is deleted successfully ",
        });
      } else {
        return res.status(404).json({
          message: "the bookmark is not found ",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.get_all_user_bookmark = (req, res) => {
  BookmarkBlogs.find({ "Blogs.userId": req.userId })
    .then((bookmarkedBlogs) => {
      res.status(200).json(bookmarkedBlogs);
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
