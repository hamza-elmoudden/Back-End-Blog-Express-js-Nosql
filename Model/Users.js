import mongoose  from "mongoose";
import joi from "joi"


const UseSchema = mongoose.Schema({
    Name:{
        type:String,
        require:true,
        trim:true,
        minLength:2,
        maxLength:20,
        lowercase:true,
    },
    age:{
        type:Number,
        trim:true,
        min:17,
        default:18
    },
    email:{
        type:String,
        require:true,
        trim:true,
        minLength:3,
        maxLength:255,
        lowercase:true,
    },
    password:{
        type:String,
        minLength:8,
        maxLength:1024,
        require:true
    },
    ISadmin:{
        type:Boolean,
        default:false,
    }
})

const User = mongoose.model("User",UseSchema)



export function ValidtUser(user){
   const Schema = joi.object({
        Name : joi.string().min(2).max(20).required(),
        age : joi.number().integer().greater(17).max(100),
        email: joi.string().min(3).max(255).email().required(),
        password:joi.string().min(8).max(255).required()
    })

    return Schema.validate(user)
}




export  {User}