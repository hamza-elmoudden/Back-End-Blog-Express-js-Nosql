import bcrypt from "bcrypt"
import {Router} from "express"
import {User} from "../Model/Users.js"
import _ from "lodash"
import joi from "joi"
import jwt from "jsonwebtoken"

const router = Router()

function ValiditLogin(user){
    const Schame = joi.object({
        email: joi.string().min(2).max(80).required(),
        password: joi.string().min(8).max(255).required(),
    })
    return Schame.validate(user)
}

router.post("/", async (req,res)=>{
    // Validate the login credentials.
    const Validit = ValiditLogin(req.body)

    if(Validit.error){

        return res.status(400).send(Validit.error.details[0].message)
    }   

    try {
        // Find the user with the given email address.
        let user = await User.findOne(_.pick(req.body,["email"]))

        if(!user){

            return res.status(401).send("Ronge Email OR Password ")
        }
        // Compare the given password to the user's password.
        const chakepassword =  bcrypt.compareSync(req.body.password,user.password)

        if(!chakepassword){
            return res.status(401).send("Ronge Email OR Password")
        }

        try {
            // Generate a JWT token for the user.
            const token = jwt.sign({id:user._id},process.env.TOKEN_KEY)
            // Pick the relevant user data to send to the client.
            const data = _.pick(user,["_id","Name",'email',"age"])
            // Return a 200 OK response with the JWT token and user data.
            return res.status(200).json({token,data,message:"LOGIN"})

        } catch (error) {
            return res.status(400).send(error)
        }

    } catch (error) {

        return res.status(400).send(error)

    }

})


export default router