const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const protect = require("./middleware/authMiddleware");
require("dotenv").config();

const authRoutes = require("./Routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

// Authentication Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Authentication Backend is running");
});
// Protected Test Route
app.get("/api/auth/protected", protect, (req, res) => {
  res.status(200).json({
    message: "You have access to the protected route",
    user: req.user,
  });
});
// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});