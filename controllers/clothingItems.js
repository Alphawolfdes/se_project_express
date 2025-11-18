const ClothingItem = require("../models/clothingItem");
const { OK } = require("../utils/errors");
const BadRequestError = require("../utils/BadRequestError");
const ForbiddenError = require("../utils/ForbiddenError");
const NotFoundError = require("../utils/NotFoundError");

const createItem = (req, res, next) => {
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
        return next(new BadRequestError("Invalid data passed to create item"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch((err) => next(err));
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      // Check if the logged-in user is the owner
      if (item.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError("You do not have permission to delete this item.")
        );
      }
      return ClothingItem.findByIdAndDelete(req.params.itemId).then(
        (deletedItem) => res.status(OK).send(deletedItem)
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
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
        return next(new BadRequestError("Invalid data passed to like item"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
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
        return next(new BadRequestError("Invalid data passed to unlike item"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
