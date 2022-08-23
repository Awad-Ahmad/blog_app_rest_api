const express = require("express");
const authRouter = express.Router();
const multer = require("multer");
const authController = require("../controllers/auth");
const auth = require("../middleware/auth");
const { isEmailExist } = require("../middleware/isEmailExist");
const upload = require("../utils/multer");

authRouter.post(
  "/sign-up",
  isEmailExist
  
  ,upload.fields([{
      name: "profilePicture",
      maxCount: 1,},{
      name: "coverPicture",
      maxCount: 1},
  ]),
  authController.sign_up
);
authRouter.post('/login',authController.login)

module.exports = authRouter;
