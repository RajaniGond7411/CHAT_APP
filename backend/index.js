import express from "express";
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./rout/authUser.js"
import messageRouter from "./rout/messageRout.js"
import userRouter from "./rout/userRout.js"
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();


app.use(express.json());
app.use(cookieParser());

app.use(`/api/auth`,authRouter)
app.use(`/api/message`,messageRouter);

app.use(`/api/user`,userRouter)



app.get('/',(req,res)=>{
    res.send("server is working")
})



const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    dbConnect();
    console.log(`Server running at ${PORT}`);   
})