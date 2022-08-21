const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const authRouter=require('./api/routes/auth')
const userRouter=require('./api/routes/user')
const blogRouter=require('./api/routes/blog')
const categoryRouter=require("./api/routes/category")
const bookmarkRouter=require("./api/routes/bookmark")
var multer = require('multer');
var upload = multer();
const app=express()
app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded()); 


mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/blog_app_with_flutter", {
    useNewUrlParser: true,
  })
  .then(console.log("connected successfully ")).catch((error)=>{
   console.log(error)
  });
  app.use("/api/auth",authRouter)
  app.use("/api/user",userRouter)   
  app.use('/api/category',categoryRouter)
  app.use('/api/blog',blogRouter)
  app.use("/api/bookmark",bookmarkRouter)
  const port = process.env.PORT|| 3000

app.listen(port, () => console.log("connected")); 