const Custom = require("../models/custom");
const { errorHandler } = require("../helpers/dbErrorHandler");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.customById = (req, res, next, id) => {
  Custom.findById(id)
    .exec((err, custom) => {
      if (err || !custom) {
        return res.status(400).json({
          error: "custom not found",
        });
      }
      req.custom = custom;
      next();
    });
};

exports.read = (req, res) => {
  req.custom.photo = undefined;
  return res.json(req.custom);
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
    let { title, subtitle, description } = fields;
    if (!title || !subtitle || !description) {
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
    let custom = new Custom(fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      custom.photo.data = fs.readFileSync(files.photo.path);
      custom.photo.contentType = files.photo.type;
    }

    custom.save((error, data) => {
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
    const custom = await req.custom;
    await custom.remove();
    res.json({
      message: "custom deleted",
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

    let custom = req.custom;
    custom = _.extend(custom, fields);
    if (custom.title.length > 60) {
      return res.status(400).json({
        error: "Title Should Be Less Than 60 Characters ",
      });
    }

    if (custom.subtitle.length > 60) {
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
      custom.photo.data = fs.readFileSync(files.photo.path);
      custom.photo.contentType = files.photo.type;
    }

    custom.save((err, data) => {
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
  if (req.custom.photo.data) {
    res.set("Content-Type", req.custom.photo.contentType);
    return res.send(req.custom.photo.data);
  }
  next();
};



exports.list = (req, res) => {
    Custom.find()
    .select("-photo")
    .exec((err, customs) => {
      if (err) {
        return res.status(400).json({
          error: "customs not found",
        });
      }
      res.json(customs);
    });
};

