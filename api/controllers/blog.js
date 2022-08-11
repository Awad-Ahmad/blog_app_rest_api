const Category = require("../models/category");
const User = require("../models/user");
const { Blog } = require("../models/blog");
const blogRouter = require("../routes/blog");
exports.add_blog = (req, res) => {
  User.find({ _id: req.userId })
    .then((user) => {
      if (user.length >= 1) {
        console.log(user);
        Category.find({ name: req.body.categoryName })
          .then((category) => {
            console.log(category);
            if (category.length >= 1) {
              const blog = new Blog({
                userId: req.userId,
                nameOFAuthor: user[0].userName,
                title: req.body.title,
                mainText: req.body.mainText,
                categoryName: req.body.categoryName,
                blogImage: req.file.path,
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
  User.find({ _id: req.userId })
    .then(async (user) => {
      if (user[0].followings.length > 0) {
        for (let i = 0; i < user[0].followings.length; i++) {
          try {
            var blogOfFollowings = await Blog.find({
              userId: user[0].followings[i],
            }).sort({ createdAt: -1 });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        }
      } else {
        blogOfFollowings = [];
      }
      try {
        catNames = [];
        catNames = await Promise.all(
          user[0].categoriesFollowings.map((catId) => {
            Category.find({ _id: catId }).then((value) => {
              catNames.push(value);
            });
          })
        );

        blogOfUser = [];
        await Promise.all(
          catNames.map((catName) => {
            Blog.find({ categoryName: catName }).then((value) => {
              blogOfUser.push(value);
            });
          })
        );

        // var blogOfUser = await Blog.find({ userId: req.userId }).sort({createdAt: -1});
      } catch (error) {
        res.status(500).json({
          error: error.message,
        });
      }

      res.status(200).json(blogOfUser.concat(...blogOfFollowings));
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
