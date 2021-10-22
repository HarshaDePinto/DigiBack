const Restaurant = require("../models/restaurant");
const Salad = require("../models/salad");
const Soup = require("../models/soup");
const Food = require("../models/food");
const Addon = require("../models/addon");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.restaurantById = (req, res, next, id) => {
  Restaurant.findById(id).exec((err, restaurant) => {
    if (err || !restaurant) {
      return res.status(400).json({
        error: "Restaurant does not exist",
      });
    }
    req.restaurant = restaurant;
    next();
  });
};

exports.create = (req, res) => {
  const restaurant = new Restaurant(req.body);
  restaurant.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.read = (req, res) => {
  return res.json(req.restaurant);
};

exports.update = (req, res) => {
  const restaurant = req.restaurant;
  restaurant.title = req.body.title;
  restaurant.location = req.body.location;
  restaurant.createdBy = req.body.createdBy;
  restaurant.updatedBy = req.body.updatedBy;
  restaurant.save((err, data) => {
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
    const restaurant = await req.restaurant;
    await restaurant.remove();
    await Salad.updateMany({ '_id': restaurant.salads }, { $pull: { restaurants: restaurant._id } });
    await Soup.updateMany({ '_id': restaurant.soups }, { $pull: { restaurants: restaurant._id } });
    await Food.updateMany({ '_id': restaurant.foods }, { $pull: { restaurants: restaurant._id } });
    await Addon.updateMany({ '_id': restaurant.addons }, { $pull: { restaurants: restaurant._id } });
    res.json({
        message: 'Restaurant deleted'
    });
   
  } catch (err) {
    console.error(err.message);
  }
};

exports.list = (req, res) => {
    Restaurant.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};
