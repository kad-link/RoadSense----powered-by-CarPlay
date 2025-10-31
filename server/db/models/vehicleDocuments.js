import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {

        fileName: {
            type:String,
            required: true,
            unique:true,
        },
        date: {
            type:String,
            required: true,
        },
        fileSize: {
            type:String,
            required: true,
        },
        fileDescription: {
            type:String,
            required: true,
        },
        fileURL: {
            type:String,
            required:true,
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }

    }, {timestamps:true}
)

export const UserDocs = mongoose.model("UserDocs", documentSchema);