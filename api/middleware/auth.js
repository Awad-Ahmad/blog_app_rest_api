const jwt=require('jsonwebtoken')
exports.auth=(req,res,next)=>{
    let token =req.header("token");
    if(!token)
    {
        return res.status(404).json({
            message:"please enter the token"
        })
    }
    jwt.verify(token,'secret',(err,decoded)=>{
        if(err)
        {
          return res.status(401).json({
            message:"Auth Failed"
          })  
        }
        else if(decoded)
        {
            req.userId=decoded.id,
            next();

        }
    })
}