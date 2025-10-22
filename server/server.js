import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/dbConnect.js";
import bcrypt from "bcryptjs";
import { User } from "./db/models/user.js";
import express from "express";
import jwt from "jsonwebtoken";
const app = express();

import cors from "cors";

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const JWT_SECRET = process.env.JWT_SECRET;

app.get("/", (req,res)=>{
    res.send("Coconut Breaks Here !");
})

app.post("/registeruser",async (req,res)=>{

  try{

  const {fullName, email, password, carModel} = req.body;

  if(!fullName || !email || !password){
    return res.status(400).json({
      success:false,
      message:"Incomplete fields"
    });
  } 

  const existingUser = await User.findOne({email});
  if(existingUser){
    return res.status(400).json({
      success:false,
      message:"Email already exists"
    });
  }

  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName,
    email,
    password:encryptedPassword,
    carModel: carModel||null
  })

  await newUser.save();

  const token = jwt.sign(
    {userId: newUser._id, email: newUser.email},
    JWT_SECRET,
    {expiresIn:"7d"}
        );

  res.status(201).json({
    success:true,
    message:"Account created successfully",
    token,
    user:{
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      carModel: newUser.carModel
    }
  });
  }
  catch(error){
    console.log(`Sign Up error: ${error}`);
    res.status(500).json({
      success:false,
      message:"Internal Server Error. Try Again . . ."
    });
    
  }
})

app.post("/loginuser",async (req,res)=>{
  try {
    const {email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"Incomplete fields"
      })
    }

    const user = await User.findOne({email});

    if(user){
      const passowrdValidator = await bcrypt.compare(password,user.password);

      if(passowrdValidator){

        const token = jwt.sign(
          {userId: user._id, email: user.email},
          JWT_SECRET,
          {expiresIn:"7d"}
        );

        return res.status(200).json({
          success:true,
          message:"Login successful",
          token,
          user:{
            id:user._id,
            email: user.email,
            fullName: user.fullName
          }
        });
      }
      else{
        return res.status(401).json({
          success:false,
          message:"Invalid credentials"
        });
      }
    }
    else{
      return res.status(404).json({
          success: false,
          message: "User not registered"
        });
    }
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Internal Server Error",
      error: error.message
    })
  }
})



app.listen(3000, ()=>{
  console.log(`Server running on port 3000`);
});



