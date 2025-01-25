import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";

dotenv.config(); // Load environment variables from .env

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Updated: Backend Node.js server is running!");
});

// Start the server
const PORT = process.env.PORT; // Attempt to access the variable

console.log("Port is:", PORT);

app.listen(PORT || 5000, () => {
  // Connect to Database
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT || 5000}`);
});
