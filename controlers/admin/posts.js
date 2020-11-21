const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const post = require('../../models/post')
const router = new express.Router()
const Posts = require('../../models/post')
const Cate = require('../../models/cate')
const User = require('../../models/user')
const{isEMpty} = require('../../helper/uploadhelper')
const fs = require('fs')
const path = require('path')
const { userInfo } = require('os')
router.all('/*',(req,res,next)=>{
req.app.locals.layout = 'admin'
next()
})

router.get('/create',(req,res)=>{
    Cate.find({}).then(cate=>{
        res.render('admin/posts/create',{cate:cate})
    })
})
router.get('/edit/:id',(req,res)=>{
    Posts.findById(req.params.id).then(posts=>{
        Cate.find({}).then(cate=>{
            res.render('admin/posts/edit',{posts:posts,cate:cate})
        })
})
})
router.get('/', (req,res)=>{
    Posts.find({}).populate('category').then(posts=>{
    res.render('admin/posts/allpost',{posts:posts})
})
})
router.post('/create',async(req,res)=>{
    console.log(req.files)
    let filename = req.files.file.name
    let data = Date.now()+"_"+filename
    let image = req.files.file.data.toString('base64')
    if(!isEMpty(req.files)){
        let file = req.files.file
        let filename = Date.now() +"_"+ file.name
        file.mv('./public/uploads/'+ filename ,(err)=>{
            if(err) throw err
        })
    }
 

let allowcomments = true
if(req.body.allowcomments){
    allowcomments=true
}else{
    allowcomments=false
}    
const newpost = new Posts({
    title:req.body.title,
    author:req.body.author,
    status:req.body.status,
    allowComment:allowcomments,
    description:req.body.description,
    body:req.body.body,
    category:req.body.categories,
    file:req.files,
    imageref:image

})
try {
    await newpost.save()
    req.flash('success_message','Post was created successfully')
    res.redirect('/admin/posts')
} catch (error) {
    console.log(error)
}

    // console.log(newpost)
    
})

 // <.................UPADATE..............<
router.patch('/edit/:id',async(req,res)=>{
Posts.findById(req.params.id).then(post=>{
    let allowcomments = true
if(req.body.allowcomments){
    allowcomments=true
}else{
    allowcomments=false
}
post.title = req.body.title
post.author = req.body.author
post.imageref=req.files.file.data.toString('base64')
post.status = req.body.status
post.allowComment = allowcomments
post.category= req.body.categories
post.description=req.body.description
post.body = req.body.body


     post.save().then((upadted)=>{
         req.flash('updated',`${post.title} hasbeen updated successfully`)
        res.redirect('/admin/posts')
     })



})
})

//<...................DELETE........................<
router.delete('/:id',(req,res)=>{
    Posts.findByIdAndDelete(req.params.id,(error,data)=>{
        if(data){
            req.flash('deleted',`${data.title} hasbeen deleted successfully`)
            res.redirect('/admin/posts')
        }
    })
})


router.post('/login' ,(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:"/admin",
        failureRedirect:'/login'

    })(req,res,next)
})








module.exports=router