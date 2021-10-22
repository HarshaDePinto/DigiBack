const Recode = require("../models/recode");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.recodeById = (req, res, next, id) => {
  Recode.findById(id).exec((err, recode) => {
    if (err || !recode) {
      return res.status(400).json({
        error: "recode does not exist",
      });
    }
    req.recode = recode;
    next();
  });
};

exports.create = (req, res) => {
  const recode = new Recode(req.body);
  recode.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.read = (req, res) => {
  return res.json(req.recode);
};


exports.remove = async (req, res) => {
  try {
    const recode = await req.recode;
    await recode.remove();
    res.json({
      message: "recode deleted",
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.list = (req, res) => {
    Recode.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};


exports.recodeByDateRange = (req, res) => {
    let { startDate, endDate, inventoryId } = req.body;
    if (startDate === "" || endDate === "") {
      return res.status(400).json({
        status: "failure",
        message: "Please ensure you pick two dates",
      });
    }
    if(inventoryId){
      Recode.find({
        createdAt: {
          $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
          $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
        },inventoryId:inventoryId,
      }).populate("inventoryId").exec((err, recode) => {
        if (err) {
          return res.status(400).json({
            error: "recodes not found",
          });
        }
        res.json(recode);
      });
    }
    if(!inventoryId){
      Recode.find({
        createdAt: {
          $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
          $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
        }
      }).populate("inventoryId").exec((err, recode) => {
        if (err) {
          return res.status(400).json({
            error: "recodes not found",
          });
        }
        res.json(recode);
      });
    }
    
  };
