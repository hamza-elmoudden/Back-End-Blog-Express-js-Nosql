import mongoose, { Schema } from "mongoose";
import joi from "joi";

const commentSchema = mongoose.Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        minLength:2,
        maxLength:40,
        trim:true,
        ref:"User"
        
    },
    description:{
        type:String,
        minLength:1,
        maxLength:200,
        trim:true,
    
    }
    
})


const BlogSchema = mongoose.Schema({
    title : {
        type:String,
        minLength:2,
        maxLength:50,
        lowercase:true,
        trim:true,
        require:true
    },
    description:{
        type:String,
        minLength:2,
        maxLength:3000,
        lowercase:true,
        trim:true,
        require:true
    },
    catégorie:{
        type:String,
        minLength:2,
        maxLength:20,
        lowercase:true,
        trim:true,
        require:false
    },
    data:{
        type:Date,
        default:Date.now()
    },
    like:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comment:[commentSchema],
    Owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        trim:true,
        minLength:5,
        maxLength:255,
        require:true
    }
})


const Blog = mongoose.model("Blog",BlogSchema)



export function ValidBlog(Blog){

   const Schema = joi.object({
        title: joi.string().min(2).max(50).required(),
        description: joi.string().min(2).max(3000).required(),
        Owner: joi.string().min(5).max(255).required(),
        catégorie:  joi.string().min(5).max(30)
    })

    return Schema.validate(Blog)
}

export function Validcommentg(Blog){

    const Schema = joi.object({
         description: joi.string().min(2).max(200).required(),
     })
 
     return Schema.validate(Blog)
 }

 export function ValidUpd(Blog){

    const Schema = joi.object({
        title: joi.string().min(2).max(50).required(),
        description: joi.string().min(2).max(3000).required(),
        catégorie:  joi.string().min(5).max(30)
     })
 
     return Schema.validate(Blog)
 }

export  {Blog}