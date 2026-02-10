import userSchema from "../validation/user.validation.js";
import { verify } from "jsonwebtoken";

const validationMiddleware = (schema)=>(req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }
    next();
};

const authenticate = (req,res,next)=>{
    const token = req.cookie.token;
    if(!token){
        return res.status(400).json({message: "Unauthorized"});
    }
    try{
        const decode = verify(token, process.env.JWT_SECRET_KEY);
        next();
    }
    catch(error){
        res.status(401).json({
            message: "Invalid token"
        });
    }
}

export default {
    validationMiddleware,
    authenticate
};