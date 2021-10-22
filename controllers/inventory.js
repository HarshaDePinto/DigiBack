const Inventory = require("../models/inventory");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.inventoryById = (req, res, next, id) => {
  Inventory.findById(id).exec((err, inventory) => {
    if (err || !inventory) {
      return res.status(400).json({
        error: "inventory does not exist",
      });
    }
    req.inventory = inventory;
    next();
  });
};

exports.create = (req, res) => {
  const inventory = new Inventory(req.body);
  inventory.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.read = (req, res) => {
  return res.json(req.inventory);
};

exports.update = (req, res) => {
  const inventory = req.inventory;
  inventory.title = req.body.title;
  inventory.code = req.body.code;
  inventory.createdBy = req.body.createdBy;
  inventory.updatedBy = req.body.updatedBy;
  inventory.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = async (req, res) => {
  try {
    const inventory = await req.inventory;
    await inventory.remove();
    res.json({
      message: "inventory deleted",
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.list = (req, res) => {
    Inventory.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.inventoryByCode = (req, res) => {
  Inventory.findOne({ code: req.body.promoCode }).exec((err, inventory) => {
    if (err) {
      return res.status(400).json({
        error: "inventory not found",
      });
    }
    res.json(inventory);
  });
};
