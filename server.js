const express = require('express')
const exphbs = require('express-handlebars')
const bodyparse = require('body-parser')
const passport = require('passport')
const methodover = require('method-override')
const fileup = require('express-fileupload')
const session = require('express-session')
const flash = require('connect-flash')

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')
//databse connection
require('./models/mongo')
require('./controlers/admin/passport')(passport)

const app = express()
//views engine configurations
app.use(methodover('_method'))
app.use(express.static('public'))

const {select,generatetime}= require('./helper/handlehelper')
app.engine('handlebars',exphbs({handlebars:allowInsecurePrototypeAccess(Handlebars),helpers:{select:select,generatetime:generatetime} ,defaultLayout:'home'}))
app.set('view engine' , 'handlebars')
app.use(fileup())
app.use(session({
    secret:"nkusikevin",
    resave:true,
    saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req,res,next)=>{
res.locals.success_message = req.flash('success_message')
res.locals.updated = req.flash('updated')
res.locals.deleted = req.flash('deleted')
res.locals.user = req.flash('user')
next()
})
//using body-parser module
// app.use(bodyparse.urlencoded({extended:false}))
// app.use(bodyparse.json())
app.use(express.urlencoded({extended:false}))

const home = require('./controlers/home/main')
const admin = require('./controlers/admin/admin') 
const posts = require('./controlers/admin/posts') 
const cat = require('./controlers/admin/cat')
const newuser = require('./controlers/admin/register')

app.use('/admin',admin)
app.use('/',home)
app.use('/admin/posts',posts)
app.use('/admin/categories', cat)
app.use('/admin/register', newuser)

port = process.env.PORT || 4000
app.listen(port,()=>{
    console.log(`server is up on port ${port}`)
})