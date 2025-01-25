import mongoose from "mongoose";

export async function connectToDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected: ", conn.connection.host);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
}

  