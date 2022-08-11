const express = require("express");
const authRouter = express.Router();
const multer = require("multer");
const authController = require("../controllers/auth");
const auth = require("../middleware/auth");
const { isEmailExist } = require("../middleware/isEmailExist");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg"
  )
    cb(null, true);
  else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
    fileFilter: fileFilter,
  },
});
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
