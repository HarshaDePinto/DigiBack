const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const SaladCategory = require("../models/saladCategory");
const Salad = require("../models/salad");
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
    let saladCategory = new SaladCategory(fields);
    if (files.photo1) {
      if (files.photo1.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      saladCategory.photo1.data = fs.readFileSync(files.photo1.path);
      saladCategory.photo1.contentType = files.photo1.type;
    }
    if (files.photo2) {
      if (files.photo2.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      saladCategory.photo2.data = fs.readFileSync(files.photo2.path);
      saladCategory.photo2.contentType = files.photo2.type;
    }

    saladCategory.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(data);
    });
  });
};

exports.saladCategoryById = (req, res, next, id) => {
  SaladCategory.findById(id).exec((error, saladCategory) => {
    if (error || !saladCategory) {
      res.status(400).json({
        error: "Salad Category not found",
      });
    }
    req.saladCategory = saladCategory;
    next();
  });
};

exports.read = (req, res) => {
  req.saladCategory.photo1 = undefined;
  req.saladCategory.photo2 = undefined;
  return res.json(req.saladCategory);
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

    let saladCategory = req.saladCategory;
    saladCategory = _.extend(saladCategory, fields);
    if (saladCategory.title.length > 40) {
      return res.status(400).json({
        error: "Title Should Be Less Than 60 Characters ",
      });
    }

    if (saladCategory.description.length > 60) {
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
      saladCategory.photo1.data = fs.readFileSync(files.photo1.path);
      saladCategory.photo1.contentType = files.photo1.type;
    }

    if (files.photo2) {
      if (files.photo2.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      saladCategory.photo2.data = fs.readFileSync(files.photo2.path);
      saladCategory.photo2.contentType = files.photo2.type;
    }

    saladCategory.save((err, data) => {
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
  if (req.saladCategory.photo1.data) {
    res.set("Content-Type", req.saladCategory.photo1.contentType);
    return res.send(req.saladCategory.photo1.data);
  }
  next();
};

exports.photo2 = (req, res, next) => {
  if (req.saladCategory.photo2.data) {
    res.set("Content-Type", req.saladCategory.photo2.contentType);
    return res.send(req.saladCategory.photo2.data);
  }
  next();
};
exports.homeSaladCategory = (req, res) => {
  SaladCategory.find()
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

exports.adminSaladCategoryList = (req, res) => {
  SaladCategory.find()
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
  const saladCategory = req.saladCategory;
  Salad.find({ saladCategory:saladCategory._id }).exec((err, data) => {
      if (data.length >= 1) {
          return res.status(400).json({
            error: `Sorry. You can not delete ${saladCategory.title}. It has ${data.length} associated Set Salads.`
          });
      } else {
        saladCategory.remove((err, data) => {
              if (err) {
                  return res.status(400).json({
                      error: errorHandler(err)
                  });
              }
              res.json({
                  message: 'Salad Category deleted'
              });
          });
      }
  });
};