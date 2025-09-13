const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
    app.use(express.json());

    // Test authorization middleware
    app.use((req, res, next) => {
      req.user = { _id: "64f8c0e2a2b1c2d3e4f5a6b7" }; // Replace with your test user's ID
      next();
    });

    app.use("/", mainRouter);
    app.listen(PORT, () => {
      // Server started
    });
  } catch (err) {
    // Failed to connect to MongoDB
  }
}

startServer();
