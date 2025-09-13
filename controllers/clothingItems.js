const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  OK,
  NOT_FOUND,
} = require("../utils/errors");

const createItem = (req, res) => {
  // ...existing code...

  const { name, weather, imageUrl } = req.body;
  // ...existing code...

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      // ...existing code...
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed to create item" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." })
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((deletedItem) =>
      res
        .status(OK)
        .send({ message: "Item deleted successfully", data: deletedItem })
    )
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed to like item" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed to unlike item" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
