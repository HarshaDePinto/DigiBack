const User = require("../models/user");
const formidable = require("formidable");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.read = (req, res) => {
  req.profile.salt = undefined;
  req.profile.hashed_password = undefined;
  req.profile.otp = undefined;
  return res.json(req.profile);
};
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.userByMobile = (req, res, next, mobile) => {
  User.findOne({ mobile: mobile }, (err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.update = (req, res) => {
  const { name, password, email, mobile } = req.body;

  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password should be min 6 characters long",
        });
      } else {
        user.password = password;
      }
    }

    if (email) {
      user.email = email;
    }

    if (mobile) {
      user.mobile = mobile;
    }

    user.save((err, updatedUser) => {
      if (err || !updatedUser) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      if(updatedUser){
        updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
      }
    });
  });
};

exports.verifyUserMobile = (req, res) => {
  console.log(req.body);
  User.findById(req.body.id).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "User not found",
      });
    }
    
    if (user && req.body.newOtp === user.otp) {
      user.mobile_verified = true;
      user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        user.otp = undefined;
        res.json(user);
      });
    } else {
      res.status(400).json({
        error: "OTP Does Not Match",
      });
    }
  });
};

exports.resend = (req, res) => {
  User.findById(req.body.id).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "User not found",
      });
    }
    if (user) {
      user.otp = req.body.otp;
      user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }

        user.salt = undefined;
        user.hashed_password = undefined;
        user.otp = undefined;
        res.json(user);
      });
    }
  });
};

exports.userByRole = (req, res) => {
  User.find({ role: req.body.role })
    .select("-hashed_password")
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: "Users not found",
        });
      }
      res.json(users);
    });
};

exports.singleUpdate = (req, res) => {
  const { id, name, password, active } = req.body;

  User.findOne({ _id: id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password should be min 6 characters long",
        });
      } else {
        user.password = password;
      }
    }

    if (active) {
      user.active = active;
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log("USER UPDATE ERROR", err);
        return res.status(400).json({
          error: "User update failed",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};

exports.singleById = (req, res, next, id) => {
  User.findById(id).exec((err, single) => {
    if (err || !single) {
      res.status(400).json({
        error: "single user not found",
      });
    }
    req.single = single;
    next();
  });
};

exports.removeSingle = (req, res) => {
  let single = req.single;
  single.remove((error, deletedAddOn) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    res.json({ message: "User deleted successfully" });
  });
};
