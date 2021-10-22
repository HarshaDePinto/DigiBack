const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const MainSlider = require("../models/mainSlider");
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
    let { title, subtitle, active } = fields;
    if (!title || !subtitle || !active) {
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
    let mainSlide = new MainSlider(fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      mainSlide.photo.data = fs.readFileSync(files.photo.path);
      mainSlide.photo.contentType = files.photo.type;
    }

    mainSlide.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(data);
    });
  });
};

exports.mainSlideById = (req, res, next, id) => {
  MainSlider.findById(id).exec((error, mainSlide) => {
    if (error || !mainSlide) {
      res.status(400).json({
        error: "Slide not found",
      });
    }
    req.mainSlide = mainSlide;
    next();
  });
};

exports.read = (req, res) => {
  req.mainSlide.photo = undefined;
  return res.json(req.mainSlide);
};

exports.remove = (req, res) => {
  let mainSlide = req.mainSlide;
  mainSlide.remove((error, deletedMainSlide) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    res.json({ message: "Slide deleted successfully" });
  });
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

    let mainSlide = req.mainSlide;
    mainSlide = _.extend(mainSlide, fields);
    if (mainSlide.title.length > 60) {
      return res.status(400).json({
        error: "Title Should Be Less Than 60 Characters ",
      });
    }

    if (mainSlide.subtitle.length > 60) {
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
      mainSlide.photo.data = fs.readFileSync(files.photo.path);
      mainSlide.photo.contentType = files.photo.type;
    }

    mainSlide.save((err, data) => {
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
  if (req.mainSlide.photo.data) {
    res.set("Content-Type", req.mainSlide.photo.contentType);
    return res.send(req.mainSlide.photo.data);
  }
  next();
};

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  MainSlider.find()
    .select("-photo")
    .sort({ [sortBy]: [order] })
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.frontSlide = (req, res) => {
  MainSlider.find({ active: "true" })
    .select("-photo")
    .limit(3)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};