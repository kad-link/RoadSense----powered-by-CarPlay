import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect
        (`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log(`MongoDB connected ...`);
        console.log(`DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`MongoDB connection error: `, error);
        process.exit(1)
    }
}

export default connectDB 