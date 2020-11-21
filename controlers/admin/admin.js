const express = require('express')
const Posts = require('../../models/post')
const faker = require('faker')
const router = new express.Router()
router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin'
    next()
})
router.get('/',(req,res)=>{
    res.render('admin/index')
})

router.post('/generate-fake-posts',(req,res)=>{


for(let i=0 ; i<= req.body.amount ; i++){
let post = new Posts
post.title= faker.name.title()
post.status='public'
post.allowComment=faker.random.boolean()
post.body=faker.lorem.sentence()

post.save().then(post=>{
    res.redirect('/admin')
})

}

})
module.exports= router