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
            required:function () {
                return this.authProvider === "local";
                    }, 
        },
        carModel:{
            type:String
        },
        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },
        googleUID: {
            type: String,
        },
        profilePic: {
            type: String,
        },
    }, {timestamps:true}
)

export const User = mongoose.model("User", userSchema);