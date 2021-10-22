const Restaurant = require("../models/restaurant");
const Salad = require("../models/salad");
const { errorHandler } = require("../helpers/dbErrorHandler");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.saladById = (req, res, next, id) => {
  Salad.findById(id)
    .populate("saladCategory")
    .exec((err, salad) => {
      if (err || !salad) {
        return res.status(400).json({
          error: "Salad not found",
        });
      }
      req.salad = salad;
      next();
    });
};

exports.read = (req, res) => {
  req.salad.photo = undefined;
  return res.json(req.salad);
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
    let { title, subtitle, description, saladCategory } = fields;
    if (!title || !subtitle || !description || !saladCategory) {
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
    let salad = new Salad(fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      salad.photo.data = fs.readFileSync(files.photo.path);
      salad.photo.contentType = files.photo.type;
    }

    salad.save((error, data) => {
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
    const salad = await req.salad;
    await salad.remove();
    await Restaurant.updateMany(
      { _id: salad.restaurants },
      { $pull: { salads: salad._id } }
    );
    res.json({
      message: "Salad deleted",
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

    let salad = req.salad;
    salad = _.extend(salad, fields);
    if (salad.title.length > 60) {
      return res.status(400).json({
        error: "Title Should Be Less Than 60 Characters ",
      });
    }

    if (salad.subtitle.length > 60) {
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
      salad.photo.data = fs.readFileSync(files.photo.path);
      salad.photo.contentType = files.photo.type;
    }

    salad.save((err, data) => {
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
  if (req.salad.photo.data) {
    res.set("Content-Type", req.salad.photo.contentType);
    return res.send(req.salad.photo.data);
  }
  next();
};

exports.saladByCategory = (req, res) => {
  Salad.find({ saladCategory: req.saladCategory._id })
    .select("-photo")
    .exec((err, salads) => {
      if (err) {
        return res.status(400).json({
          error: "Salad not found",
        });
      }
      res.json(salads);
    });
};

exports.list = (req, res) => {
  Salad.find()
    .select("-photo")
    .exec((err, salads) => {
      if (err) {
        return res.status(400).json({
          error: "Salads not found",
        });
      }
      res.json(salads);
    });
};

exports.changeAvailable = (req, res,next) => {
  const saladId = req.body.saladId;
  const restaurantId = req.body.restaurantId;
  const work = req.body.work;

  if (work) {
    Salad.findByIdAndUpdate(
      saladId,
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
      { $push: { salads: saladId } },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("added");
      }
    );

    res.json(saladId);
    next();
  }

  if (!work) {
    Salad.findByIdAndUpdate(
      saladId,
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
      { $pull: { salads: saladId } },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("added");
      }
    );
    res.json(saladId);
    next();
  }
};
