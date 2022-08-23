const mongoose = require("mongoose");

userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  bio:{
    type:String
  },
  email: {
    type: String,
    required: true,
    // unique: true,
    validate: {
      validator: (value) => {
        const re =
          /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        return value.match(re);
      },
      message: "please enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  profilePicture: {
    type: String,
  },
  coverPicture:  {
    url:{
     type:String,
    },
    public_id:{
     type:String,
    }
   },
  followers:[],
  categoriesFollowings:[],
  followings: {
    type: Array,
    default: [],
  },  desc:{
    type:String,
    max:50
  },
  city:{
    type:String,
    max:50
  },
  form:{
    type:String
  },
  isAdmin:{
    type:Boolean,
    default:false,
  }
},
{timestamps:true}
);
const User=mongoose.model("User",userSchema)
module.exports=User