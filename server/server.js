import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/dbConnect.js";
import bcrypt from "bcryptjs";
import { User } from "./db/models/user.js";
import express from "express";
import jwt from "jsonwebtoken";
import { Trip } from "./db/models/trips.js";
import { UserDocs } from "./db/models/vehicleDocuments.js";
import upload from "./middleware/multer.js"
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


app.post("/trip/:email", async(req,res)=>{
  try {
    const {source, destination, duration, distance} =req.body;
    const {email} = req.params;


    if(!source || !destination || !duration || !distance ){
    return res.status(400).json({
      success:false,
      message:"Trip fields incomplete"
    });
  } 

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
  return res.status(404).json({
    success: false,
    message: "User not found"
  });
}


const myDate = new Date();
const formattedDate = myDate.toLocaleDateString('en-GB'); 

  const newTrip = new Trip({
    source,
    destination,
    duration,
    distance,
    user: foundUser._id,
    date: formattedDate
  })

  await newTrip.save();

  res.status(201).json({
    success:true,
    message:"Trip saved successfully",
  });

  } catch (error) {
    console.log(`Trip storing failed : ${error}`);
    res.status(500).json({
      success:false,
      message:"Internal Server Error. Trip storing unsucessful. Try Again . . ."
    });
  }
})

app.get("/trip/:email", async(req,res)=>{
  try{const {email} = req.params;
  const isUser = await User.findOne({email});

  if(!isUser){
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  const trips= await Trip.find({user: isUser._id}).sort({_id:-1});

  if(!trips.length){
    return res.status(200).json({
      success:true,
      message:"No trips found for this user",
      trips: [],
    })
  }

  res.status(200).json({
    success:true,
    message: "Trips fetched successfully",
    trips,
  })}
  catch(error){
    console.error("Trip fetching failed : " + error);
    res.status(500).json({
      success:false,
      message:"Internal Server Error. Could not fetch trips.",
    })
    
  }
})

app.post("/docs/:email", upload.single("file"), async(req,res)=>{
  try{
    const {email} = req.params;
    const { fileDescription } = req.body;

    const isUser= await User.findOne({email});

    if(!isUser){
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  if(!req.file){
    return res.status(400).json({
      success:false,
      message:"No file uploaded",
    })
  }

  if(!fileDescription){
    return res.status(400).json({
      success: false,
      message: "File Description is required"
    })
  }
  const fileURL = req.file.path; 
  const originalName = req.file.originalname;
  const fileSize= req.file.size;

  const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      };

    

  console.log("Uploaded File info: ", req.file);
  console.log("User email: ", req.params.email);
  console.log("File description: ", req.body.fileDescription);

  const myDate = new Date();
  const formattedDate = myDate.toLocaleDateString('en-GB');

  const newDoc = new UserDocs({
    fileName: originalName,
    date: formattedDate,
    fileSize: formatFileSize(fileSize),
    fileDescription,
    fileURL,
    user: isUser._id,
  })

  await newDoc.save();


  return res.status(200).json({
    success:true,
    message: "File upload successful"
  })
  
  
  //continue from here



  }
  catch(error){
    console.error("File uploading error: ", error);
      if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A file with this name already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message
    });

  }
})


app.get("/docs/:email", async(req,res)=>{
  
  try
  {const {email} = req.params;

  const user = await User.findOne({email});

  if(!user){
    return res.status(404).json({
      success:false,
      message:"User not found",
    })
  }

  const documents= await UserDocs.find({user: user._id}).sort({_id:-1});

  if(!documents.length){
    return res.status(200).json({
      success:true,
      message:"No documents found for this user",
      documents: [],
    })
  }

  res.status(200).json({
    success:true,
    message:"Documents fetched successfully",
    documents,
  })}
  
  catch(error){
    console.error("Documents fetching failed : " , error);
    res.status(500).json({
      success:false,
      message:"Internal Server Error. Could not fetch documents.",
    })
  }

})

app.listen(3000, ()=>{
  console.log(`Server running on port 3000`);
});



