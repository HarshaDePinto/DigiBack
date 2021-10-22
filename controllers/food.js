const Restaurant = require("../models/restaurant");
const Food = require("../models/food");
const { errorHandler } = require("../helpers/dbErrorHandler");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.foodById = (req, res, next, id) => {
  Food.findById(id)
    .populate("foodCategory")
    .exec((err, food) => {
      if (err || !food) {
        return res.status(400).json({
          error: "food not found",
        });
      }
      req.food = food;
      next();
    });
};

exports.read = (req, res) => {
  req.food.photo = undefined;
  return res.json(req.food);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true;
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Image can not be uploaded",
      });
    }
    let { title, subtitle, description, foodCategory } = fields;
    if (!title || !subtitle || !description || !foodCategory) {
      return res.status(400).json({
        error: "All fields required",
      });
    }
    if (title.length > 60) {
      return res.status(400).json({
        error: "Title Should Be Less Than 60 Characters ",
      });
    }
    if (subtitle.length > 60) {
      return res.status(400).json({
        error: "Subtitle Should Be Less Than 60 Characters ",
      });
    }
    let food = new Food(fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      food.photo.data = fs.readFileSync(files.photo.path);
      food.photo.contentType = files.photo.type;
    }

    food.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(data);
    });
  });
};



exports.remove = async (req, res) => {
  try {
    const food = await req.food;
    await food.remove();
    await Restaurant.updateMany(
      { _id: food.restaurants },
      { $pull: { foods: food._id } }
    );
    res.json({
      message: "food deleted",
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.update = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image can not be uploaded",
      });
    }

    let food = req.food;
    food = _.extend(food, fields);
    if (food.title.length > 60) {
      return res.status(400).json({
        error: "Title Should Be Less Than 60 Characters ",
      });
    }

    if (food.subtitle.length > 60) {
      return res.status(400).json({
        error: "Subtitle Should Be Less Than 60 Characters ",
      });
    }

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      food.photo.data = fs.readFileSync(files.photo.path);
      food.photo.contentType = files.photo.type;
    }

    food.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
  });
};


exports.photo = (req, res, next) => {
  if (req.food.photo.data) {
    res.set("Content-Type", req.food.photo.contentType);
    return res.send(req.food.photo.data);
  }
  next();
};

exports.foodByCategory = (req, res) => {
  Food.find({ foodCategory: req.foodCategory._id })
    .select("-photo")
    .exec((err, foods) => {
      if (err) {
        return res.status(400).json({
          error: "food not found",
        });
      }
      res.json(foods);
    });
};

exports.list = (req, res) => {
  Food.find()
    .select("-photo")
    .exec((err, foods) => {
      if (err) {
        return res.status(400).json({
          error: "foods not found",
        });
      }
      res.json(foods);
    });
};

exports.changeAvailable = (req, res,next) => {
  const foodId = req.body.foodId;
  const restaurantId = req.body.restaurantId;
  const work = req.body.work;

  if (work) {
    Food.findByIdAndUpdate(
      foodId,
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
      { $push: { foods: foodId } },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("added");
      }
    );

    res.json(foodId);
    next();
  }

  if (!work) {
    Food.findByIdAndUpdate(
      foodId,
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
      { $pull: { foods: foodId } },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("added");
      }
    );
    res.json(foodId);
    next();
  }
};
