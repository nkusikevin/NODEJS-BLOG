const mongoose = require('mongoose')
const slug = require('slugify')
const { default: slugify } = require('slugify')
const postschema = new mongoose.Schema({
category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"categories"
},title:{
    type:String,
    required:true,
},
author:{
    type:String,
    required:true,
},
description:{
    type:String,
    required:true,
},
status:{
    type:String,
    default:"public"
},
allowComment:{
    type:Boolean,
    required:true,
},date:{
    type:Date,
    default:()=>Date.now()
},
body:{
    type:String,
    required:true,
},
file:[{}],
imageref:{
    type:String
},slug:{
    type:String,
    required:true,
    unique:true
}

})

postschema.pre('validate', function(next){
    if(this.title){
        this.slug = slugify(this.title,{lower:true,strict:true})
    }
    next()
})

const post = mongoose.model('blogpost',postschema)
module.exports= post