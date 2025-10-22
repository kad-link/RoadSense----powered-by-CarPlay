import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {

        fullName: {
            type:String,
            required: String,
        },
        email:{
            type:String,
            required:true,
            unique:true, 
            lowercase:true
        },
        password:{
            type:String,
            required:true
        },
        carModel:{
            type:String
        }

    }, {timestamps:true}
)

export const User = mongoose.model("User", userSchema);