const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const FoodCategory = require("../models/foodCategory");
const Food = require("../models/food");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true;
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Image can not be uploaded",
      });
    }
    let { title, description } = fields;
    if (!title || !description) {
      return res.status(400).json({
        error: "All fields required",
      });
    }
    if (title.length > 40) {
      return res.status(400).json({
        error: "Title Should Be Less Than 40 Characters ",
      });
    }
    if (description.length > 60) {
      return res.status(400).json({
        error: "Description Should Be Less Than 60 Characters ",
      });
    }
    let foodCategory = new FoodCategory(fields);
    if (files.photo1) {
      if (files.photo1.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      foodCategory.photo1.data = fs.readFileSync(files.photo1.path);
      foodCategory.photo1.contentType = files.photo1.type;
    }
    if (files.photo2) {
      if (files.photo2.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      foodCategory.photo2.data = fs.readFileSync(files.photo2.path);
      foodCategory.photo2.contentType = files.photo2.type;
    }

    foodCategory.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(data);
    });
  });
};

exports.foodCategoryById = (req, res, next, id) => {
  FoodCategory.findById(id).exec((error, foodCategory) => {
    if (error || !foodCategory) {
      res.status(400).json({
        error: "food Category not found",
      });
    }
    req.foodCategory = foodCategory;
    next();
  });
};

exports.read = (req, res) => {
  req.foodCategory.photo1 = undefined;
  req.foodCategory.photo2 = undefined;
  return res.json(req.foodCategory);
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

    let foodCategory = req.foodCategory;
    foodCategory = _.extend(foodCategory, fields);
    if (foodCategory.title.length > 40) {
      return res.status(400).json({
        error: "Title Should Be Less Than 60 Characters ",
      });
    }

    if (foodCategory.description.length > 60) {
      return res.status(400).json({
        error: "Description Should Be Less Than 60 Characters ",
      });
    }

    if (files.photo1) {
      if (files.photo1.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      foodCategory.photo1.data = fs.readFileSync(files.photo1.path);
      foodCategory.photo1.contentType = files.photo1.type;
    }

    if (files.photo2) {
      if (files.photo2.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      foodCategory.photo2.data = fs.readFileSync(files.photo2.path);
      foodCategory.photo2.contentType = files.photo2.type;
    }

    foodCategory.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
  });
};

exports.photo1 = (req, res, next) => {
  if (req.foodCategory.photo1.data) {
    res.set("Content-Type", req.foodCategory.photo1.contentType);
    return res.send(req.foodCategory.photo1.data);
  }
  next();
};

exports.photo2 = (req, res, next) => {
  if (req.foodCategory.photo2.data) {
    res.set("Content-Type", req.foodCategory.photo2.contentType);
    return res.send(req.foodCategory.photo2.data);
  }
  next();
};
exports.homeFoodCategory = (req, res) => {
  FoodCategory.find()
    .select("-photo1")
    .select("-photo2")
    .limit(6)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.adminFoodCategoryList = (req, res) => {
  FoodCategory.find()
    .select("-photo1")
    .select("-photo2")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.remove = (req, res) => {
  const foodCategory = req.foodCategory;
  Food.find({ foodCategory:foodCategory._id }).exec((err, data) => {
      if (data.length >= 1) {
          return res.status(400).json({
            error: `Sorry. You can not delete ${foodCategory.title}. It has ${data.length} associated Set foods.`
          });
      } else {
        foodCategory.remove((err, data) => {
              if (err) {
                  return res.status(400).json({
                      error: errorHandler(err)
                  });
              }
              res.json({
                  message: 'food Category deleted'
              });
          });
      }
  });
};