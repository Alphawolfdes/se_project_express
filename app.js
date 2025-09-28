const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { login, createUser, getItems } = require("./controllers/users"); // Import getItems controller
const auth = require("./middlewares/auth");

const app = express();
const { PORT = 3001 } = process.env;

async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
    app.use(express.json());
    app.use(cors());

    // Public routes (no auth)
    app.post("/signin", login);
    app.post("/signup", createUser);
    app.get("/items", getItems); // <-- Only GET /items is public

    // Protect all other routes
    app.use(auth);

    // All other routes (protected)
    app.use("/", mainRouter); // <-- All other routes require auth

    app.listen(PORT, () => {
      // Server started
    });
  } catch (err) {
    // Failed to connect to MongoDB
  }
}

startServer();
