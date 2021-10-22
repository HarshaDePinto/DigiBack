const Promotion = require("../models/promotion");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.promotionById = (req, res, next, id) => {
  Promotion.findById(id).exec((err, promotion) => {
    if (err || !promotion) {
      return res.status(400).json({
        error: "promotion does not exist",
      });
    }
    req.promotion = promotion;
    next();
  });
};

exports.create = (req, res) => {
  const promotion = new Promotion(req.body);
  promotion.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.read = (req, res) => {
  return res.json(req.promotion);
};

exports.update = (req, res) => {
  const promotion = req.promotion;
  promotion.title = req.body.title;
  promotion.code = req.body.code;
  promotion.amount = req.body.amount;
  promotion.active = req.body.active;
  promotion.createdBy = req.body.createdBy;
  promotion.updatedBy = req.body.updatedBy;
  promotion.save((err, data) => {
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
    const promotion = await req.promotion;
    await promotion.remove();
    res.json({
      message: "Promotion deleted",
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.list = (req, res) => {
  Promotion.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.promotionByCode = (req, res) => {
  Promotion.findOne({ code: req.body.promoCode }).exec((err, promotion) => {
    if (err) {
      return res.status(400).json({
        error: "Promotion not found",
      });
    }
    res.json(promotion);
  });
};
