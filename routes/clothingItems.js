const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

//Create
router.post("/", createItem);
//Read
router.get("/", getItems);
//Update
router.patch("/:itemId", updateItem);
//Delete
router.delete("/:itemId", deleteItem);
module.exports = router;
