import {Router} from "express"
import {User,ValidtUser} from "../Model/Users.js"
import _ from "lodash"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import auth from "../middleware/auth.js"
const router = Router()



router.post("/registr",async (req,res)=>{
    // Validate the user input
    const Valididt = ValidtUser(req.body)
    if(Valididt.error){
        return res.status(401).send(Valididt.error.details[0].message)
    }
    try {
        // Check if a user with the given email already exists
        let user = await User.findOne(_.pick(req.body,["email"]))

        if(user){
           return res.status(400).send("email is fond")
        }
        // Create a new user object from the request body
        user = new User(_.pick(req.body,["Name","age","email","password"]))
        // Generate a salt and hash the user's password
        const saltRounds = 10

        const Slat =  bcrypt.genSaltSync(saltRounds)

        user.password =  bcrypt.hashSync(user.password,Slat)
        // Save the new user to the database
        await user.save()
        try {
            // Generate a JWT token for the new user
            const token = jwt.sign({id:user._id},process.env.TOKEN_KEY)

            const data = _.pick(user,["_id","Name","email","age"])

            return res.status(200).json({token,data})

        } catch (error) {

            return res.status(400).send(error)

        }
        
    } catch (error) {
      return  res.status(500).send("Something went wrong.");
    }

})


.get("/",auth,async (req,res)=>{

    try {
        // Decode the JWT token from the request
        const decodedToken = jwt.verify(token,process.env.TOKEN_KEY);

        // Find the user in the database using the decoded token's ID
        const user = await User.findOne({ _id: decodedToken.id });
        
        // Return a subset of the user's information in the response
        return res.send(_.pick(user,["_id","Name","age","email"]))
    } catch (error) {
        return res.sendStatus(400)
    }

})


export default router








