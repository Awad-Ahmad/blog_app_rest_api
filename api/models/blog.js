const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    nameOFAuthor:{
      type:String,
      required:true

    },
    title: {
      type: String,
      required: true,
      max:60
    },
    mainText: {
      type: String,
      min: 80,
      required: true,
    },
    blogImage: {
     url:{
      type:String,
      required:true
     },
     public_id:{
      type:String,
      required:true
     }
    },
    categoryName: {
      type: String,
      required: true, 
    },
    isBookMarked:{
      type:Boolean,
      default:false
    },
    numOfReads:[]
  },
  { timestamps: true }
);
const Blog = mongoose.model("Blog", blogSchema);
module.exports = {Blog,blogSchema};
