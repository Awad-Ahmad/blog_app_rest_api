const express = require("express");
const authRouter = express.Router();
const multer = require("multer");
const authController = require("../controllers/auth");
const auth = require("../middleware/auth");
const { isEmailExist } = require("../middleware/isEmailExist");
const { authValidation } = require("../middleware/validation/auth_validate");
const { loginAuthValidation } = require("../middleware/validation/login_auth_validation");
const upload = require("../utils/multer");

authRouter.post(
  "/sign-up",
  authValidation,
  isEmailExist

  
  ,upload.fields([{
      name: "profilePicture",
      maxCount: 1,},{
      name: "coverPicture",
      maxCount: 1},
  ]),
  authController.sign_up
);
authRouter.post('/login',loginAuthValidation,authController.login)

module.exports = authRouter;
