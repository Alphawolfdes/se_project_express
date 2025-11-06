const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users"); // Correct import
require("dotenv").config();
const { getItems } = require("./controllers/clothingItems"); // Correct import
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  validateUserBody,
  validateAuthentication,
} = require("./middlewares/validation");

const app = express();
const { PORT = 3001 } = process.env;

async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
    app.use(express.json());
    app.use(cors());

    // enable request logger
    app.use(requestLogger);

    // Public routes (no auth)
    app.post("/signin", validateAuthentication, login);
    app.post("/signup", validateUserBody, createUser);
    app.get("/items", getItems); // <-- Only GET /items is public

    // Protect all other routes
    app.use(auth);

    // All other routes (protected)
    app.use("/", mainRouter); // <-- All other routes require auth

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
