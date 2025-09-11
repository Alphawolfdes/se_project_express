const router = require("express").Router();
const clothingItemsRouter = require("./clothingItems");

router.use("/items", clothingItemsRouter);

const usersRouter = require("./users");

router.use("/users", usersRouter);

// Catch-all 404 handler
router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
