import jwt from "jsonwebtoken"
import config from "../config/bd.config";

export const verifyToken = (req, res, next) =>{
 const token = req.header("Authorization");

 //verify that token exists
if(!token){
   //if doesnt exist returns a answer
  return res.status(401).json({
      success: false,
      msg: 'Autorización requerida'
   })
}

const SplitToken = token.split(" ");

//Verify that the authorization is Bearer
if (SplitToken[0] !== "Bearer"){
   //Returns a authorization answer
  return res.status(401).json({
      success: false,
      msg: 'Autorización requerida'
   })
}

jwt.verify(SplitToken[1], config.jwt_hash, (error, decode)=>{
if(error){
   return res.status(201).json({
      success: false,
      msg: 'Autorización requerida'
   })

}
   next();
})

//  res.status(200).json({
//     sucess: true,
//     token : token,
//     msn: 'This is a message'
//  })
}