const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
    app.use("/", mainRouter);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

startServer();
