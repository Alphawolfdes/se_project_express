const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

const clothingItemsRouter = require("./clothingItems");
const usersRouter = require("./users");

// Crash test endpoint (for testing PM2 auto-recovery)
router.get("/crash-test", (req, res) => {
  res.send("Server will crash in a moment...");
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Public routes (no auth required)
router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);
router.get("/items", getItems); // Public access to get all items

// Apply authentication middleware to all routes below
router.use(auth);

// Protected routes (auth required)
router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);

const NotFoundError = require("../utils/NotFoundError");
// Catch-all 404 handler
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
