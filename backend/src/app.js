import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import {createServer} from "node:http";
import mongoose, { Mongoose } from 'mongoose';
import cors from 'cors';



// import the Socket->1
import {connectTOSocket} from './controllers/socketManager.js';
//import route in user
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);

//import the Socket->1
const io =  connectTOSocket(server);

const PORT =  process.env.PORT || 5000;
const allowedOrigins = [
  "https://dearconnect.onrender.com",
  "http://localhost:3000"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb" , extended:true}));
app.use("/api/v1/users",userRoutes);

app.get("/home",(req,res)=>{
    res.send("Welcome to Zoom");
})




const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1); 
    }
};

connectMongoDB();


const start = async ()=>{

    server.listen(PORT,(req,res)=>{
        console.log(`page is runing in ${PORT}`);
    })
};

start();