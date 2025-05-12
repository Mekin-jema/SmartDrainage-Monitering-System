import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();
export const generateToken = (res, user ) => {
    const token = jwt.sign({userId:user._id}, process.env.API_SECRET, {expiresIn:'1d'});
    res.cookie("token", token, {httpOnly:true, sameSite:'strict', maxAge:24*60*60*1000});
    return token;
}