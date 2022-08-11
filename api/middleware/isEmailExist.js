const User = require("../models/user")

exports.isEmailExist=(req,res,next)=>{
    User.find({email:req.body.email}).then((user)=>{
        console.log("the user"+ req.body.email
        )
        if(user.length>=1)
        {
             return  res.status(403).json({
                message:"the email is already exist"
            })
   
        }
        else
        {
            next();
        }
    }).catch((error)=>{
        res.status(500).json({
            error:error.message
        })
    })
}