require("dotenv").config();
const mongoose = require("mongoose");


const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    }catch(error){
        console.log("Database connection failure");
    }
};

module.exports = connectDb;