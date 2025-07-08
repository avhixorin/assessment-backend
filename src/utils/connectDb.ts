import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoDbURI = `${process.env.MONGODB_URI}/ASSESSMENT`;
    const connectionInstance = await mongoose.connect(mongoDbURI);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;