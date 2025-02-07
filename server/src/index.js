import mongoose from "mongoose";
import {app} from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({
    path:'./env'
})

connectDB().then(()=>{
    console.log("Database connected");
   
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running on  ${process.env.PORT}`);

    })
}
).catch((e)=>{
    console.log("Error",e);
    process.exit(1);
})
