const Addon = require("../models/addon");
const Restaurant = require("../models/restaurant");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.addonById = (req, res, next, id) => {
  Addon.findById(id).exec((err, addon) => {
    if (err || !addon) {
      return res.status(400).json({
        error: "Addon does not exist",
      });
    }
    req.addon = addon;
    next();
  });
};


exports.create = (req, res) => {
  const addon = new Addon(req.body);
  addon.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.read = (req, res) => {
  return res.json(req.addon);
};

exports.update = (req, res) => {
  const addon = req.addon;
  addon.title = req.body.title;
  addon.price = req.body.price;
  addon.available = req.body.available;
  addon.role = req.body.role;
  addon.createdBy = req.body.createdBy;
  addon.updatedBy = req.body.updatedBy;
  addon.save((err, data) => {
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
    const addon = await req.addon;
    await addon.remove();
    await Restaurant.updateMany(
      { _id: addon.restaurants },
      { $pull: { addons: addon._id } }
    );
    res.json({
      message: "Addon deleted",
    });
  } catch (err) {
    console.error(err.message);
  }
};


exports.addonByRole = (req, res) => {
  Addon.find({ role: req.body.addonRole })
    .exec((err, addon) => {
      if (err) {
        return res.status(400).json({
          error: "Addons not found",
        });
      }
      res.json(addon);
    });
};

exports.changeAvailable = (req, res,next) => {
  const addonId = req.body.addonId;
  const restaurantId = req.body.restaurantId;
  const work = req.body.work;

  if (work) {
    Addon.findByIdAndUpdate(
      addonId,
      { $push: { restaurants: restaurantId } },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("added");
      }
    );
    Restaurant.findByIdAndUpdate(
      restaurantId,
      { $push: { addons: addonId } },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("added");
      }
    );

    res.json(addonId);
    next();
  }

  if (!work) {
    Addon.findByIdAndUpdate(
      addonId,
      { $pull: { restaurants: restaurantId } },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("added");
      }
    );
    Restaurant.findByIdAndUpdate(
      restaurantId,
      { $pull: { addons: addonId } },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("added");
      }
    );
    res.json(addonId);
    next();
  }
};

exports.list = (req, res) => {
  Addon.find().exec((err, data) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      }
      res.json(data);
  });
};
