const Restaurant = require("../models/restaurant");
const Soup = require("../models/soup");
const { errorHandler } = require("../helpers/dbErrorHandler");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.soupById = (req, res, next, id) => {
  Soup.findById(id)
    .exec((err, soup) => {
      if (err || !soup) {
        return res.status(400).json({
          error: "soup not found",
        });
      }
      req.soup = soup;
      next();
    });
};

exports.read = (req, res) => {
  req.soup.photo = undefined;
  return res.json(req.soup);
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
    let { title, subtitle, description} = fields;
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
    let soup = new Soup(fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image can not be greater than 1mb",
        });
      }
      soup.photo.data = fs.readFileSync(files.photo.path);
      soup.photo.contentType = files.photo.type;
    }

    soup.save((error, data) => {
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
    const soup = await req.soup;
    await soup.remove();
    await Restaurant.updateMany(
      { _id: soup.restaurants },
      { $pull: { soups: soup._id } }
    );
    res.json({
      message: "soup deleted",
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

    let soup = req.soup;
    soup = _.extend(soup, fields);
    if (soup.title.length > 60) {
      return res.status(400).json({
        error: "Title Should Be Less Than 60 Characters ",
      });
    }

    if (soup.subtitle.length > 60) {
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
      soup.photo.data = fs.readFileSync(files.photo.path);
      soup.photo.contentType = files.photo.type;
    }

    soup.save((err, data) => {
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
  if (req.soup.photo.data) {
    res.set("Content-Type", req.soup.photo.contentType);
    return res.send(req.soup.photo.data);
  }
  next();
};



exports.list = (req, res) => {
    Soup.find()
    .select("-photo")
    .exec((err, soups) => {
      if (err) {
        return res.status(400).json({
          error: "soups not found",
        });
      }
      res.json(soups);
    });
};

exports.changeAvailable = (req, res,next) => {
  const soupId = req.body.soupId;
  const restaurantId = req.body.restaurantId;
  const work = req.body.work;

  if (work) {
    Soup.findByIdAndUpdate(
        soupId,
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
      { $push: { soups: soupId } },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("added");
      }
    );

    res.json(soupId);
    next();
  }

  if (!work) {
    Soup.findByIdAndUpdate(
        soupId,
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
      { $pull: { soups: soupId } },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("added");
      }
    );
    res.json(soupId);
    next();
  }
};
