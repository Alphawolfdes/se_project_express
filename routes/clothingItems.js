const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const {
  validateCardBody,
  validateItemId,
} = require("../middlewares/validation");

// Create
router.post("/", validateCardBody, createItem);
// Read
router.get("/", getItems);
// Delete
router.delete("/:itemId", validateItemId, deleteItem);

// Like and Unlike
router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, unlikeItem);
module.exports = router;
