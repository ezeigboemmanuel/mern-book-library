import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";
import cors from "cors";
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import Book from "./models/book.model.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

dotenv.config(); // Load environment variables from .env

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();

// Middlewares
app.use(express.json({ limit: "20mb" }));
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    credentials: true, // Include credentials (cookies) in requests
  })
);
app.use(cookieParser());

const __dirname = path.resolve();

// Test route
app.get("/", (req, res) => {
  res.send("Updated: Backend Node.js server is running!");
});

// Start the server
const PORT = process.env.PORT; // Attempt to access the variable

console.log("Port is:", PORT);

// ================== Authentication ===============

// Sign up

app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      throw new Error("All fields are required.");
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: "Username is taken, try another name." });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const userDoc = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // jwt

    if (userDoc) {
      const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return res
      .status(200)
      .json({ user: userDoc, message: "User created successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Log in

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcryptjs.compareSync(
      password,
      userDoc.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // jwt

    if (userDoc) {
      const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    res.status(200).json({
      message: "Logged in successfully.",
      user: userDoc,
    });
  } catch (error) {
    console.log("Error logging in", error);
    res.status(400).json({ mesage: error.message });
  }
});

// Fetch User

app.get("/api/fetch-user", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userDoc = await User.findById(decoded.id).select("-password"); // Find all fields except the password

    if (!userDoc) {
      return res.status(400).json({ message: "User not found." });
    }

    res.status(200).json({
      user: userDoc,
    });
  } catch (error) {
    console.log("Error in fetching user", error);
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/logout", async (req, res) => {
  res.clearCookie("token"); // Remove the authentication token
  res.status(200).json({ message: "Logged out successfully." });
});

app.post("/api/add-book", async (req, res) => {
  const { image, title, subtitle, author, link, review } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    // Verify user authentication
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find the user in the database
    const userDoc = await User.findById(decoded.id).select("-password");

    // Upload image to Cloudinary
    const imageResponse = await cloudinary.uploader.upload(image);

    // Create a new book entry
    const book = await Book.create({
      image: imageResponse.secure_url, // Store Cloudinary image URL
      title,
      subtitle,
      author,
      link,
      review,
      user: userDoc,
    });

    return res.status(200).json({ book, message: "Book added successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/fetch-books", async (req, res) => {
  try {
    // Retrieve all books from the database, sorted by creation date (latest first)
    const books = await Book.find().sort({ createdAt: -1 });

    // Send the books as a response
    return res.status(200).json({ books });
  } catch (error) {
    // Handle any errors
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/fetch-book/:id", async (req, res) => {
  try {
    // Extract the book ID from the request parameters
    const { id } = req.params;

    // Find the book in the database and populate the user field (only username)
    const book = await Book.findById(id).populate("user", ["username"]);

    // Send the book data as a response
    return res.status(200).json({ book });
  } catch (error) {
    // Handle any errors
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/update-book/:id", async (req, res) => {
  const { image, title, subtitle, author, link, review } = req.body;
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  const { id } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const book = await Book.findById(id);

    if (image) {
      // Delete the previous one first
      const parts = book.image.split("/");
      const fileName = parts[parts.length - 1]; // Extract the last part: "ihwklaco9wt2d0kqdqrs.png"
      const imageId = fileName.split(".")[0];
      cloudinary.uploader
        .destroy(`Favlib/${imageId}`)
        .then((result) => console.log("result: ", result));

      // Then upload the new one
      const imageResponse = await cloudinary.uploader.upload(image, {
        folder: "/Favlib",
      });

      const updatedBook = await Book.findByIdAndUpdate(id, {
        image: imageResponse.secure_url,
        title,
        subtitle,
        author,
        link,
        review,
      });

      return res
        .status(200)
        .json({ book: updatedBook, message: "Book updated successfully." });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, {
      title,
      subtitle,
      author,
      link,
      review,
    });

    return res
      .status(200)
      .json({ book: updatedBook, message: "Book updated successfully." });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/delete-book/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const book = await Book.findById(id);

    // Delete the image first
    const parts = book.image.split("/");
    const fileName = parts[parts.length - 1]; // Extract the last part: "ihwklaco9wt2d0kqdqrs.png"
    const imageId = fileName.split(".")[0];
    cloudinary.uploader
      .destroy(imageId)
      .then((result) => console.log("result: ", result));

    // Then delete from database
    await Book.findByIdAndDelete(id);

    return res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    console.log("Search: ", searchTerm);
    const books = await Book.find({
      title: { $regex: searchTerm, $options: "i" },
    }).sort({ createdAt: -1 });

    return res.status(200).json({ books });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT || 5000, () => {
  // Connect to Database
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT || 5000}`);
});
