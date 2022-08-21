const User = require("../models/user");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
exports.sign_up = (req, res) => {
  User.find({ email: req.body.email }).exec()
    .then((user) => {
      console.log(user)

      if (user.length >= 1) {
        console.log(req.files)
        
        if (req.files) {
          profilePicturePath = path.join(
            __dirname,
            "../../",
            req.files.profilePicture[0].path
          );
        } else {
          profilePicturePath = null;
        }
        if(req.files)
 {
          coverPicturePath = path.join(
            __dirname,
            "../../",
            req.files.coverPicture[0].path
          );
        } else {
          coverPicturePath = null;
        }
        console.log(coverPicturePath);
        try {
          if (profilePicturePath)
            fs.unlink(profilePicturePath, (error) => {
              console.log(error);
            });
          if (coverPicturePath)
            fs.unlink(coverPicturePath, (error) => {
              console.log(error);
            });
          res.status(404).json({
            message: "the user has been added before",
          });
        } catch (error) {
          return res.status(500).json({
            error: error.message,
          });
        }
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err.message,
            });
          } else {
            if (req.files) {
              console.log("true");
            } else {
              console.log("false");
            }
            const user = new User({
              email: req.body.email,
              password: hash,
              userName: req.body.userName,
              profilePicture: req.files
                ? req.files.profilePicture[0].path
                : "",
              coverPicture: req.files
                ? req.files.coverPicture[0].path
                : "",
              isAdmin: req.body.isAdmin,
            })
              .save()
              .then((value) => {
                res.status(201).json({
                  message: "the user is created successfully ",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  error: error.message,
                });
              });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.login = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({
            message: "the email is not found ",
          })
          .catch((error) => {
            res.status(500).json({
              error: error.message,
            });
          });
      } else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(404).json({
              message: "auth failed",
            });
          } else {
            const token = jwt.sign(
              {
                email: user.email,
                id: user.id,
                password: user.password,
              },
              "secret",
              {
                expiresIn: "1000000000000000h",
              }
            );
            return res.status(200).json({
              token,
              user: user,
            });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
