import {Blog,ValidBlog,Validcommentg,ValidUpd} from "../Model/Blogs.js"
import {Router} from "express"
import _ from "lodash"
import auth from "../middleware/auth.js"
import delete_auth from "../middleware/delet_auth.js"
import put_auth from "../middleware/put_auht.js"
import  jwt  from "jsonwebtoken";



const router = Router()

// router.get("/", async(req,res)=>{

//     const Listblog = await Blog.find({})

//     if(!Listblog){
//         return  res.status(404).send("Not Found")
//     }
//     return res.status(200).send(Listblog)
    
// })


.get("/", async (req,res)=>{
    try {
        // Get the page number and limit from the query parameters.
        const {page=1,limit=10}= req.query
        // Find all blog posts, sorted by name.
        const blog = await  Blog.find({})
        .sort("Name")
        .limit(limit *1)
        .skip((page -1) * limit).exec()

        // Populate the like and owner fields for each blog post.
        await Promise.all(
            blog.map(async (e) => {
              await e.populate("like", "Name _id");
                     
            })
          );

        await Promise.all(
            blog.map(async (e) => {
              await e.populate("Owner", "Name _id");
                     
            })
          );
        // Return the blog posts to the client.
        return res.status(200).send(blog)
    } catch (error) {
        return res.sendStatus(400)
    }
})


.get("/",async (req,res)=>{
    const{title} = req.query
    const blog = await Blog.find({ title: { $regex: new RegExp(title, 'i') } })
})


.get("/:id",async (req,res)=>{
    // Find the blog post by its ID.
    const blog = await Blog.findOne({
        _id: req.params.id,
    })
    // Populate the `Owner` field with the owner's name and ID.
    .populate("Owner","Name _id")
    // Populate the `like` field with the liker's name and ID.
    .populate("like","Name _id")
    // If the blog post is not found, return a 404 Not Found response.
    if(!blog){
      return  res.status(404).send("Not Found")
    }
    return res.status(200).send(blog)
})

.get("/MYPOST/:id", async (req,res)=>{
    try {
        // Try to find all blogs for the given user ID
        const blog = await Blog.find({"Owner":req.params.id})
        
        // **Populate the `like` and `Owner` fields**
        // This will replace the `like` and `Owner` fields with the corresponding documents from the database
        await Promise.all(
            blog.map(async (e) => {
              await e.populate("like", "Name _id");
                     
            })
          );

        await Promise.all(
            blog.map(async (e) => {
              await e.populate("Owner", "Name _id");
                     
            })
          );
        res.status(200).send(blog)
    } catch (error) {
        res.status(500).send("ERROR")
    }
 
})


.get("/LIKEPOST/:id",async(req,res)=>{
    try {
        // Try to find all blogs in the database.
        const blog = await Blog.find({});
        // Filter the blogs to only include the blog with the given ID.
        const my_like = blog.filter((e) => String(e.like) === req.params.id)
        // If no blog is found with the given ID, return a 400 Bad Request response.
        if(!my_like){
            res.status(400).send("Not found")
        }
        // Return a 200 OK response with the blog.
        return res.status(200).send(my_like)
    } catch (error) {
        return res.sendStatus(400)
    }
})



.post('/',auth, async(req, res) => {
    try {
        // Validate the request body
        const valid = ValidBlog(_.pick(req.body,["title","description","catégorie","Owner"]))

        if(valid.error){
            // If validation fails, return a 400 Bad Request response with the validation error message
            res.status(400).json({massage:valid.error.details[0].message})
        }
         // Create a new blog post object from the validated request body
        let blog = new Blog(_.pick(req.body,["title","description","catégorie","Owner"]))

        // Save the blog post to the database
        blog = await blog.save()
        res.status(200).json({massage:"Carte post",data:blog})

    } catch (error) {
        res.status(500).send(error.message)
    }
})




.put("/:id/Like",auth,async (req,res)=>{
    try {
        // Get the user's ID from the authorization token
        const token = req.headers.authorization;

        const user_id = jwt.verify(token,process.env.TOKEN_KEY).id
        // Find the blog post to be liked.
        const blog =  await Blog.findOne({_id:req.params.id})
        // Check if the user has already liked the blog post.
        const foundIndex =   blog.like.findIndex((e)=> String(e) === user_id)
        // If the user has already liked the blog post, remove their like.
        if(foundIndex !== -1){
            blog.like.splice(foundIndex,1)
        }else{
            // Add the user's like to the blog post.
            blog.like = [...blog.like,user_id]
        }
        // Save the blog post.
        await blog.save()
        return res.sendStatus(200)
    } catch (error) {
        // Return a success response.
        return res.sendStatus(400)
    }
})


.put("/:id/comment",auth,async (req,res)=>{
    const token = req.headers.authorization;
    const user_id = jwt.verify(token,process.env.TOKEN_KEY).id

    try {
        // Validate the comment request
        const validco = Validcommentg(req.body)
        if(validco.error){
          return  res.status(400).json({massage:validco.error.details[0].message})
        }
        // Find the blog to add the comment to
        const blog =  await Blog.findOne({_id:req.params.id})
        const foundIndex =  await blog.comment.findIndex((e)=> String(e.id) === user_id)
        if(foundIndex !== -1){
            blog.comment[foundIndex].description = req.body.description
        }else{
            // Add the comment to the blog
            blog.comment = [...blog.comment,{id:user_id,description:req.body.description}]
        }
        // Save the blog
        await blog.save()
        return res.sendStatus(200)
    } catch (error) {
        // Handle any errors
        return res.sendStatus(400)
    }
})




.delete("/:id",[auth,delete_auth],async(req,res)=>{
   
    try {
        // Find and delete the blog post
        await Blog.findByIdAndDelete(req.params.id)
        // If the blog post was deleted successfully, send a 200 OK response
        return res.sendStatus(200)
    } catch (error) {

        res.status(400).send(error)
    }
})



.put("/:id",[auth,put_auth],async(req,res)=>{
    
    try {
        // Use the `ValidUpd` function to validate the updated blog post data.

        const ValidU = ValidUpd(_.pick(req.body,["title","description","catégorie"]))

        // If the validation fails, return a 400 Bad Request response with the validation error message.

        if(ValidU.error){

          return res.status(400).json({massage:ValidU.error.details[0].message})

        }

        // Use the `findOneAndUpdate` method to update the blog post in the database.

        await Blog.Model.findOneAndUpdate({
            _id: req.params.id,
        }, _.pick(req.body,["title","description","catégorie"])).save();

        // Return a 200 OK response if the blog post was updated successfully.
        return res.sendStatus(200)
    } catch (error) {
        // Return a 400 Bad Request response if an error occurred while updating the blog post.
        res.status(400).send(error)
    }
})

export default router