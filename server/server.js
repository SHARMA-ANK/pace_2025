const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URI = "mongodb+srv://ar318527:ar318527@cluster0.6nait.mongodb.net/mydatabase?retryWrites=true&w=majority";

// Replace <db_password> with your actual MongoDB password
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Sample Route
app.get("/", (req, res) => {
  res.send("MongoDB Connected!");
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
