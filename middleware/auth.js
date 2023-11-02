import { User } from "../Model/Users.js";
import  jwt  from "jsonwebtoken";
import _ from "lodash"



export default async function  (req, res, next) {

  const token = req.headers.authorization;
  // If there is no token, return a 401 Unauthorized response.
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" ,error:"Token not found"});
  }
  // Try to verify the token using the secret key defined in the environment variables.
  try {

    const decodedToken = jwt.verify(token,process.env.TOKEN_KEY);
    // Find the user in the database using the ID from the decoded token.
    const user = await User.findOne({ _id: decodedToken.id });
    // If the user is not found, return a 401 Unauthorized response.
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // The token is valid and the user is authenticated.
    // Allow the request to proceed by calling the next middleware function.

    return next();

  } catch (error) {
    // The token is invalid or expired.
    // Return a 401 Unauthorized response.
    return res.status(401).json({ message: "Unauthorized" ,error:" Invalid Token"});
  }

  
}
