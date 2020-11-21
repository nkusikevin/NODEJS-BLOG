const express = require('express')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const router = new express.Router()
router.all("*",(req,res,next)=>{
    req.app.locals.layout ="admin"
    next()
})
router.get('/',(req,res)=>{
    res.render('admin/registerusers/register')
})
router.get('/users',(req,res)=>{
    User.find({}).then(user=>{
        res.render('admin/registerusers/allusers',{user:user})
    })
})
router.post('/register', (req,res)=>{
    const {firstName,lastName,email,password,passwordConfirm} = req.body
    let errors = []
    if(!firstName  || !lastName || !email || !password ||!passwordConfirm){
        req.flash('user',`please fill in all fields`)
    errors.push({message:"please fill in all fields "})
    }
    if(password.length < 6){
        errors.push({message:"password must be six characters"})
    }
    if(password !== passwordConfirm){
        errors.push({message:"password must match"})
        req.flash('user',`password must match`)
    }
    if(errors.length > 0){
        console.log('error one'+ errors)
        res.render('registerusers/register',{
            errors,
            firstName,
            lastName,
            password,
            passwordConfirm
    })
    }else{
        User.findOne({email:email}).then(user=>{
            console.log('error two')
            if(user){
                req.flash('user',`Email is already taken`)
                errors.push({message:"email is registered"})
                res.render('admin/registerusers/register',{
                    errors,
                    firstName,
                    lastName,
                    password,
                    passwordConfirm
            })
            }else{
                const newuser = new User({
                    firstName,
                    lastName,
                    email,
                    password
                })
    bcrypt.genSalt(8,(err,salt)=>bcrypt.hash(newuser.password ,salt,(error,hash)=>{
        if(error) throw error
        newuser.password = hash
        newuser.save().then(user=>{
            req.flash('user',`user hasbeen  Successfully Created`)
            res.redirect('/admin/register')
        }).catch(error => console.log(error))
    }))
            }
        })
    }
    
    
    }) 

module.exports=router