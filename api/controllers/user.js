const User = require("../models/user");
const Category = require("../models/category");
const { Blog } = require("../models/blog");
const fs = require("fs");
const path = require("path");
const upload = require("../utils/multer");

const cloudinary = require("../utils/cloudinary");
exports.delete_user = (req, res) => {
  User.find({ _id: req.userId })
    .then((user) => {
      console.log(user);
      if (user.length >= 1) {
        User.findByIdAndDelete(req.userId)
          .then(async (value) => {
            console.log(value);
            var blogs = await Blog.find({ userId: req.userId });

            Blog.deleteMany({ userId: req.userId })
              .then((blog) => {
                for (let i = 0; i < blogs.length; i++) {
                  cloudinary.uploader.destroy(
                    blogs[i].blogImage.public_id,
                    function (result) {
                      console.log(result);
                    }
                  );
                }
                res.status(200).json({
                  message: "the user is deleted successfully",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  error: error.message,
                });
              });
          })
          .catch((error) => {
            res.status(500).json({
              error: error.message,
            });
          });
      } else {
        return res.status(404).json({
          message: "the user is not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.update_user = (req, res) => {
  User.find({ _id: req.userId })
    .then((user) => {
      console.log(user.length);
      if (user.length >= 1) {
        console.log(req.body);
        User.findByIdAndUpdate(req.userId, { $set: req.body }, { new: true })
          .then((value) => {
            res.status(200).json({
              value: value,
              message: "the user has been updated",
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: error.message,
            });
          });
      } else {
        res.status(404).json({
          message: "the user is not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};
exports.upload_user_images = (req, res) => {
  User.find({ _id: req.userId })
    .then((user) => {
      console.log(user.length);
      if (user.length >= 1) {
        const result = cloudinary.uploader
          .upload(req.file.path)
          .then((val) => {
            User.findByIdAndUpdate(req.userId, {
              coverPicture: {
                url: val.secure_url,
                public_id: val.public_id,
              },
            })
              .then((value) => {
                Blog.updateMany(
                  { userId: req.userId },
                  {
                    userImage: val.secure_url,
                  }
                )
                  .then((val) => {
                    console.log(val);
                    res.status(200).json({
                      message: "the user has been updated",
                    });
                  })
                  .catch((error) => {
                    res.status(500).json({ error: error.message });
                  });
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json({
                  error: error.message,
                });
              });
          })
          .catch((err) => {
            res.status(500).json({
              error: err.message,
            });
          });
      } else {
        res.status(404).json({
          message: "the user is not found",
        });
      }
    })
    .catch((error) => {
      console.log(error);

      res.status(500).json({ error: error.message });
    });
};
exports.get_one_user = (req, res) => {
  User.findOne({ _id: req.userId })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "the user is not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.get_one_user_by_id = (req, res) => {
  User.find({ _id: req.params.userId })
    .then((user) => {
      if (user.length >= 1) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "the user is not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.get_all_users = (req, res) => {
  User.find()
    .where("_id ")
    .exec()
    .then((users) => {
      let sortedUsers = users.sort(
        (a, b) => b.followers.length - a.followers.length
      );
      res.status(200).json(sortedUsers);
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.follow_user = async (req, res) => {
  console.log(req.userId);
  console.log(req.params.id);
  if (req.userId === req.params.id) {
    console.log("true");
    return res.status(403).json({
      message: "you can't follow yourself",
    });
  } else {
    console.log("ffa");
    try {
      const currentUser = await User.find({ _id: req.userId });

      const otherUser = await User.find({ _id: req.params.id });

      if (currentUser.length >= 1 && otherUser.length >= 1) {
        if (!currentUser[0].followings.includes(req.params.id)) {
          await currentUser[0].updateOne({
            $push: { followings: req.params.id },
          });
          await otherUser[0].updateOne({ $push: { followers: req.userId } });
          res.status(200).json({
            message: "you follow successfully",
          });
        } else {
          if (currentUser[0].followings.includes(req.params.id)) {
            await currentUser[0].updateOne({
              $pull: { followings: req.params.id },
            });
            await otherUser[0].updateOne({ $pull: { followers: req.userId } });
            res.status(200).json({
              message: "you un follow successfully",
            });
          }
        }
      } else {
        return res.status(404).json({
          message: "check users ids",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
};
exports.un_follow_user = async (req, res) => {
  console.log(req.userId);
  console.log(req.params.id);
  if (req.userId === req.params.id) {
    console.log("true");
    return res.status(403).json({
      message: "you can't follow yourself",
    });
  } else {
    console.log("ffa");
    try {
      const currentUser = await User.find({ _id: req.userId });

      const otherUser = await User.find({ _id: req.params.id });

      if (currentUser.length >= 1 && otherUser.length >= 1) {
        if (currentUser[0].followings.includes(req.params.id)) {
          await currentUser[0].updateOne({
            $pull: { followings: req.params.id },
          });
          await otherUser[0].updateOne({ $pull: { followers: req.userId } });
          res.status(200).json({
            message: "you un follow successfully",
          });
        } else {
          return res.status(403).json({
            message: "you have already un-follow this user",
          });
        }
      } else {
        return res.status(404).json({
          message: "check users ids",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
};
exports.follow_category = async (req, res) => {
  try {
    const user = await User.find({ _id: req.userId });
    if (user.length >= 1) {
      const category = await Category.find({ _id: req.params.categoryId });
      if (category.length >= 1) {
        if (!user[0].categoriesFollowings.includes(req.params.categoryId)) {
          await user[0].updateOne({
            $push: { categoriesFollowings: req.params.categoryId },
          });
          await category[0].updateOne({
            $push: {
              followers: req.userId,
            },
          });
          res.status(200).json({
            message: "you follow the category successfully",
          });
        } else {
          if (user[0].categoriesFollowings.includes(req.params.categoryId)) {
            await user[0].updateOne({
              $pull: { categoriesFollowings: req.params.categoryId },
            });
            await category[0].updateOne({
              $pull: {
                followers: req.userId,
              },
            });
            res.status(200).json({
              message: "you un-follow the category successfully",
            });
          } else {
            return res.status(403).json({
              message: "you already un-follow this category ",
            });
          }
        }
      } else {
        return res.status(404).json({
          message: "the category is not found",
        });
      }
    } else {
      return res.status(404).json({
        message: "the user is not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.un_follow_category = async (req, res) => {
  try {
    const user = await User.find({ _id: req.userId });
    if (user.length >= 1) {
      const category = await Category.find({ _id: req.params.categoryId });
      if (category.length >= 1) {
        if (user[0].categoriesFollowings.includes(req.params.categoryId)) {
          await user[0].updateOne({
            $pull: { categoriesFollowings: req.params.categoryId },
          });
          await category[0].updateOne({
            $pull: {
              followers: req.userId,
            },
          });
          res.status(200).json({
            message: "you un-follow the category successfully",
          });
        } else {
          return res.status(403).json({
            message: "you already un-follow this category ",
          });
        }
      } else {
        return res.status(404).json({
          message: "the category is not found",
        });
      }
    } else {
      return res.status(404).json({
        message: "the user is not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.search_for_user = (req, res) => {
  User.find({
    userName: {
      $regex: req.params.userName,
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
