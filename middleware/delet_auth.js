import  jwt  from "jsonwebtoken";
import { Blog } from "../Model/Blogs.js";
import { User } from "../Model/Users.js";


export default async function(req,res,next){
    const token = req.headers.authorization;
    const user_id = jwt.verify(token,process.env.TOKEN_KEY).id
    try {
        // Try to find the blog post by ID.
        const blog = await Blog.findOne({_id:req.params.id})
        // If the blog post is not found, return a 404 error.
        if(!blog){
            return res.status(404).send('Blog not found');
        }
        // Try to find the user by ID.
        const user = await User.findOne({_id:user_id})
        // If the user is an admin, allow them to delet the blog post.
        if(user.ISadmin){

            return next()
        }
       // If the user is not the owner of the blog post, deny them access.
        if(String(blog.Owner) !== user_id){
            return res.status(500).json({massage:"Unauthorized"})
        }
        return next()
    }
    catch(error){
        return res.status(400)
    }
}