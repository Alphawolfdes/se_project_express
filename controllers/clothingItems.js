const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Error from createItem", error: err.message })
    );
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Error from getItems", error: err.message })
    );
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Error from updateItem", error: err.message })
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(204).send())
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Error from deleteItem", error: err.message })
    );
};

module.exports = { createItem, getItems, updateItem, deleteItem };
