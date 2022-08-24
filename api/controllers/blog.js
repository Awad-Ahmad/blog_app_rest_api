const Category = require("../models/category");
const User = require("../models/user");
const { Blog } = require("../models/blog");
const blogRouter = require("../routes/blog");
const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectId;
const upload = require("../utils/multer");

const cloudinary = require("../utils/cloudinary");


exports.add_blog = (req, res) => {
  User.find({ _id: req.userId })
    .then((user) => {
      if (user.length >= 1) {
        console.log(user);
        Category.find({ name: req.body.categoryName })
          .then((category) => {
            if (category.length >= 1) {
              
              const result = cloudinary.uploader.upload(req.file.path).then((val)=>{
              const blog = new Blog({
                  userId: req.userId,
                  nameOFAuthor: user[0].userName,
                  title: req.body.title,
                  userImage:user[0].coverPicture.url,
                  mainText: req.body.mainText,
                  categoryName: category[0].name,
                  blogImage: {
                    url:val.secure_url,
                    public_id:val.public_id
                  },
                })
                  .save()
                  .then((value) => {
                    res
                      .status(201)
                      .json({ message: "the blog is created successfully" });
                  })
                  .catch((error) => {
                    res.status(500).json({
                      error: error.message,
                    });
                  });

              }).catch((error)=>res.status(500).json({error:error.message}))

             
            } else {
              try {
                filePath = path.join(__dirname, "../../", req.files.path[0]);
                fs.unlink(filePath, (error) => {
                  console.log(error);
                });

                res.status(404).json({
                  message: "the user has been added before",
                });
              } catch (error) {
                console.log(error);
                return res.status(500).json({
                  error: error.message,
                });
              }

              return res.status(404).json({
                message: "the category is not found",
              });
            }
          })
          .catch((error) => {
            console.log(error);

            res.status(500).json({
              error: error.message,
            });
          });
      } else {
        try {
          filePath = path.join(__dirname, "../../", req.files.path[0]);
          fs.unlink(filePath, (error) => {
            console.log(error);
          });

          res.status(404).json({
            message: "the user has been added before",
          });
        } catch (error) {
          console.log(error);

          return res.status(500).json({
            error: error.message,
          });
        }
        res.status(404).json({
          message: "the user is not found",
        });
      }
    })
    .catch((error) => {
      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    });
};
exports.get_all_blog_for_timeline = (req, res) => {
    blogOfUser = [];
    blogOfFollowings=[];
  User.find({ _id: req.userId })
    .then(async (user) => {
      if (user[0].followings.length > 0) {
        for (let i = 0; i < user[0].followings.length; i++) {
          try {
             blogOfFollowings.push (await Blog.find({
              userId: user[0].followings[i],
            }).sort({ createdAt: -1 }));
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        }
      } else {
        blogOfFollowings = [];
      }
      try {
        var catNames = [];
        for (let i = 0; i < user[0].categoriesFollowings.length; i++) {
          await Category.findOne({ _id: user[0].categoriesFollowings[i] })
            .then((value) => {
              catNames.push(value);
            })
            .catch((error) => {
              res.status(500).json({
                error: error.message,
              });
            });
        }
      } catch (error) {
        res.status(500).json({
          error: error.message,
        });
      }
      try {
        for (let i = 0; i < catNames.length; i++) {
          theBlog = await Blog.find({ categoryName: catNames[i].name })
            .where("userId")
            .ne(user[0]._id)
            .sort({ createdAt: -1 })
            .then((blogs) => {
              blogOfUser.push(blogs);
            })
            .catch((error) => {
              res.status(500).json({
                error: error.message,
              });
            });
        }
      } catch (error) {
        return res.status(500).json({
          error: error.message,
        });
      }

      var allBlogs = blogOfUser.flat().concat(...blogOfFollowings);
      let blogUserIds = [];
      let blogIds = [];
      console.log(allBlogs)

      for (let i = 0; i < allBlogs.length; i++) {
        blogIds.push(allBlogs[i]._id);
      }
      for (let i = 0; i < allBlogs.length; i++) {
        blogUserIds.push(allBlogs[i].useId);
      }
      let c = 0;
      for (let i = 0; i < allBlogs.length; i++) {
        c = 0;
        for (let j = 0; j < allBlogs.length; j++) {
          if (allBlogs[i]._id.equals(allBlogs[j]._id)) {
            if (allBlogs[i].userId === allBlogs[j].userId) {
              console.log(allBlogs[i].userId);
            }
            c++;
          }

          if (c > 1) {
            allBlogs.splice(i, 1);
            break;
          }
        }
      }

      res.status(200).json(allBlogs);
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.get_blogs_for_specific_category = (req, res) => {
  Blog.find({ categoryName: req.params.categoryName })
    .sort({ createdAt: -1 })
    .then((blogs) => {
      res.status(200).json(blogs);
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.search_for_blogs = (req, res) => {
  Blog.find({
    title: {
      $regex: req.params.blogTitle,
      $options: "i",
    },
  })
    .exec()
    .then((results) => {
      if (results.length >= 1) {
        res.status(200).json(results);
      } else {
        res.status(404).json([]);
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.get_all_my_blogs = (req, res) => {
  Blog.find({ userId: req.userId })
    .sort({ createdAt: 1 })
    .then((value) => {
      if (value.length >= 1) {
        res.status(200).json(value);
      } else {
        res.status(404).json([]);
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.get__all_blogs = (req, res) => {
  Blog.find()
    .sort({ createdAt: 1 })
    .then((value) => {
      let sortedBlogs = value.sort(
        (a, b) => b.numOfReads.length - a.numOfReads.length
      );
      if (value.length >= 1) {
        res.status(200).json(sortedBlogs);
      } else {
        res.status(404).json([]);
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.get_blogs_for_specific_user = (req, res) => {
  Blog.find({ userId: req.params.userId })
    .then((blogs) => {
      if (blogs.length >= 1) {
        return res.status(200).json(blogs);
      } else {
        return res.status(404).json([]);
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.add_to_blog_a_read = (req, res) => {
  Blog.find({ _id: req.params.blogId })
    .then((blogs) => {
      if (blogs.length >= 1) {
        blogs[0]
          .updateOne({
            $push: {
              numOfReads: 1,
            },
          })
          .then((value) => {
            res.status(200).json({
              message: "the reads of blog is increased successfully",
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: error.message,
            });
          });
      } else {
        return res.status(404).json({
          message: "the blog is not found",
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: error });
    });
};
