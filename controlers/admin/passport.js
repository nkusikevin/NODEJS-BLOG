const localstrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
module.exports = function (passport){
    passport.use(new localstrategy({usernameField:"email"},(email , password , done)=>{
        User.findOne({email:email}).then(user=>{
            if(!user){
                console.log('email incorrect')
                return done(null , false , {message:"user email not found"})
            }
            bcrypt.compare( password , user.password ,(error,isMatch)=>{
                if (error) throw error
                if (isMatch){
                    return done(null, user)
                }else{
                    console.log('password incorrect')
                    return done(null , false , {message:"incorrect password "})
                }
            }).catch(error =>{
                console.log('unable to loggin')
            })
        })
    }))
    passport.serializeUser(function (user,done){
        done(null ,user.id)
    })
    passport.deserializeUser(function (id,done){
        User.findById(id ,function(err,user){
            done(err,user)
        })
    })
}
