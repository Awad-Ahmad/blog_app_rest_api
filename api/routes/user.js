const express = require("express");
const { auth } = require("../middleware/auth");
const userRouter = express.Router();
const userController=require("../controllers/user");
const multer=require('multer')
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
userRouter.put("/update-user",auth,userController.update_user)
userRouter.delete("/delete-user",auth,userController.delete_user)
userRouter.get('/one-user',auth,userController.get_one_user)
userRouter.get("/one-user-By-Id/:userId",userController.get_one_user_by_id)
userRouter.post("/follow/:id",auth,userController.follow_user)
userRouter.post("/follow-category/:categoryId",auth,userController.follow_category)
userRouter.post("/un-follow-category/:categoryId",auth,userController.un_follow_category)
userRouter.post("/upload-user-images",auth,upload.single("coverPicture"),userController.upload_user_images)
userRouter.post("/search-for-user/:userName",auth,userController.search_for_user)
module.exports=userRouter


