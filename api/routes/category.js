const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/category");
const { auth } = require("../middleware/auth");

categoryRouter.post("/add-category", auth, categoryController.add_category);
categoryRouter.get("/user",auth,categoryController.get_all__user_categories)
categoryRouter.post("/search-for-category/:categoryName",auth,categoryController.search_for_category)
categoryRouter.get("/",categoryController.get_all_categories)
module.exports = categoryRouter;
