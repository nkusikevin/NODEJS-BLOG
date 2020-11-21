const express = require("express");
const router = new express.Router();
const Cate = require('../../models/cate')
router.all('/*',(req,res,next)=>{
req.app.locals.layout= 'admin'
next()
})

router.get("/", (req, res) => {
    Cate.find({}).then(cat=>{
        res.render("admin/categories/index",{cat:cat});
    })
});
router.post("/create", (req, res) => {
const newcat = new Cate({
    name:req.body.name
})
newcat.save().then(cat=>{
    res.redirect("/admin/categories");
})
  });
router.get("/edit/:id", (req, res) => {
    Cate.findById(req.params.id).then(cat=>{

        res.render("admin/categories/edit",{cat:cat});
    })
});
router.patch("/edit/:id", (req, res) => {
    Cate.findById(req.params.id).then(cat=>{
        cat.name= req.body.name
        cat.save().then(cat=>{
            res.redirect('/admin/categories')
        })
        
    })
});
router.delete("/edit/:id", (req, res) => {
  Cate.findByIdAndDelete(req.params.id).then(del=>{
      res.redirect('/admin/categories')
  })
});

module.exports = router;
