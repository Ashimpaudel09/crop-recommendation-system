const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "First Name is required."]
    },
    lastname: {
        type: String, 
        required: [true, "Last Name is required."]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required."]
    },
    password: { 
        type: String, 
        select: false,
        required: [true, "Password is required."],
    }
},{
    timestamp: true,
});


const user = mongoose.model("User", userSchema);
module.exports = user;