const router = require("express").Router();
const clothingItem = require("./clothingItems");

router.use("/items", clothingItem);

const usersRouter = require("./users");

router.use("/users", usersRouter);

module.exports = router;
