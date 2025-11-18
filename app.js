require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
    app.use(express.json());
    app.use(cors());

    // enable request logger
    app.use(requestLogger);

    // All routes (public and protected)
    app.use("/", mainRouter);

    // enable error logger
    app.use(errorLogger);

    // celebrate error handler
    app.use(errors());

    // Error handling middleware (must be last)
    app.use(errorHandler);

    app.listen(PORT, () => {
      // Server started
    });
  } catch (err) {
    // Failed to connect to MongoDB
  }
}

startServer();
