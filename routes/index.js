const router = require("express").Router();
const clothingItemsRouter = require("./clothingItems");

router.use("/items", clothingItemsRouter);

const usersRouter = require("./users");

router.use("/users", usersRouter);

const { NOT_FOUND } = require("../utils/errors");
// Catch-all 404 handler
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
