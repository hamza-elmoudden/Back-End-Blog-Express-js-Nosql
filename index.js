import mongoose from "mongoose";
import express from "express";
import helmet  from "helmet";
import bodyParser from 'body-parser';
import user  from "./routes/user.js"
import login  from "./routes/login.js"
import blog from "./routes/blog.js"
import dotenv from "dotenv"

dotenv.config()



const app = express()
const port = process.env.PORT

app.use(helmet())
app.use(bodyParser.json());

mongoose.connect(process.env.DATA_BASE)
        .then(()=> app.listen(port) )
        .then(()=> console.log("connect to server on prot "+ port))
        .catch((error) => console.error(error))


app.use("/user",user)
app.use("/login",login)
app.use("/",blog)