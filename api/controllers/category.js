const { blogSchema, Blog } = require("../models/blog");
const Category = require("../models/category");
const User = require("../models/user");
var mongo = require('mongodb');

exports.add_category = (req, res) => {
  User.find({ _id: req.userId })
    .then((user) => {
      if (user.length >= 1) {
        if (user[0].isAdmin) {
          const category = new Category({
            name: req.body.name,
            userId: req.body.userId,
          })
            .save()
            .then((value) => {
              res.status(201).json({
                message: "the category is created successfully",
              });
            })
            .catch((error) => {
              res.status(500).json({
                error: error.message,
              });
            });
        } else {
          res.status(404).json({
            message: "the user is not Admin",
          });
        }
      } else {
        res.status(404).json({
          message: "the user is not found to add new category",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
exports.delete_category=(req,res)=>{
  User.findById(req.userId).then((user)=>{
    if(user.isAdmin)
    { 
      Category.findByIdAndDelete(req.params.categoryId).then((category)=>{
        Blog.deleteMany({categoryName:category.category.name}).then((value)=>{

          res.status(200).json({
            message:"the category is deleted successfully"
          })
        }).catch((error)=>res.status(500).json({
          error:error.message
        }))
      }).catch((error)=>{
        res.status(500).json({
          error:error.message
        })
      })

    }
    else
    {
      return res.status(401).json({
        message:"Authorization failed"
      })
    }
  }).catch((error)=>{
    res.status(500).json({
      error:error.message
    })
  })
}
exports.get_all__user_categories=async(req,res)=>{

  Category.find({followers:req.userId}).then(async(category)=>{
  
  
    res.status(200).json({
      category
    })
  }).catch((error)=>{
    res.status(500).json({
      error:error.message
    })
  })

}
exports.get_all_categories=async(req,res)=>{

 
  Category.find().sort({"category.name":1}).then(async(category)=>{

    ////////////////// -1 a,b ////// 1 b,a
    let sortedCategory = category.sort((a,b) => (a.followers.length > b.followers.length) ? -1 : ((b.followers.length < a.followers.length) ? 1 : 0));
 console.log(sortedCategory);
    res.status(200).json(
      sortedCategory
    )
  }).catch((error)=>{
    res.status(500).json({
      error:error.message
    })
  })

}

exports.search_for_category=(req,res)=>{
  Category.find({name:{$regex:req.params.categoryName,$options:"i"}}).exec().then((results)=>{

    if(results.length>=1)
    {
      res.status(200).json(results)

    }
    else
    {
      res.status(404).json([])
    }
  }).catch((error)=>{
    res.status(500).json({
      error:error.message
    })
  })

}
