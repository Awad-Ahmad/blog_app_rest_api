const express= require('express')
const { auth } = require('../middleware/auth')
const bookmarkRouter=express.Router()
const bookmarkController=require('../controllers/bookmark')
bookmarkRouter.post("/add-bookmark/:blogId",auth,bookmarkController.add_bookmark),
bookmarkRouter.get("/get-bookmark",auth,bookmarkController.get_all_user_bookmark)
bookmarkRouter.delete("/delete-bookmark/:bookmarkId",auth,bookmarkController.delete_bookmark)

module.exports=bookmarkRouter