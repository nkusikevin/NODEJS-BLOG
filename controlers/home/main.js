const express = require("express");
const router = new express.Router();
const Post = require('../../models/post')
const Cate = require('../../models/cate')
router.all('/*',(req,res,next)=>{
req.app.locals.layout= 'home'
next()
})
router.get("/", (req, res) => {
  Post.find({}).sort({date:"desc"}).then(posts=>{
    Cate.find({}).then(cate=>{
      res.render("home/index",{post:posts,cate:cate});
    })
    
  })

});
router.get("/post/:slug", (req, res) => {
 Post.findOne({slug:req.params.slug}).then(post=>{
   Cate.find({}).then(cate=>{
    res.render('home/viewpost',{post:post,cate:cate})
   })
 })
});
//......now.......
router.get('/category/:id',(req,res)=>{
  Post.findOne({category:req.params.id}).populate('category').then(post=>{
    res.render('home/viewall',{posts:post})
  })
  
  })
router.get("/about", (req, res) => {
  res.render("home/about");
});
router.get("/contact", (req, res) => {
  res.render("home/contact");
});
router.get("/services", (req, res) => {
  res.render("home/services");
});
router.get("/login", (req, res) => {
  res.render("home/login");
});
router.get("/register", (req, res) => {
  res.render("home/register");
});
router.get('/forgot',(req,res)=>{
  res.render("home/forget")
})
module.exports = router;
