
import express from 'express'
import {connectionDb} from './config/dbconfig.js'
const app = express();
const router = require("./routes/user.routes.js");
const PORT = 3000;
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use('/api/user',router);
// app.use(cookieParser);

    try{
        await connectionDb();
        app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(error){
        console.log("Server Error",error.message);
    }

