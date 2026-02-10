require('dotenv').config
import { findOne, create, find, password as _password, _id } from "../models/user.models.js";
import { hash, compare } from 'bcrypt';
import { sign } from "jsonwebtoken";

const signupUser = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;


    try {
        const existingUser = await findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        const hashedPassword = await hash(password, 10);
        const user = { firstname: firstname, lastname: lastname, email: email, password: hashedPassword }
        await create(user);
        res.status(201).json({ message: "Signup Successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getUser = async(req,res)=>{
      try { 
        const user = await find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body;

    try {
        const user = findOne({email});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        const isMatch = compare(password,_password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = sign({
            id: _id
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn: '1h'}
    );

    res.cookie('token',token,{
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
        sameSite: 'lax'
    });
    res.status(200).json({message: "Login Successfully"});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
}

export default {signupUser,getUser};