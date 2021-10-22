const User = require("../models/user");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");

// using promise
exports.register = (req, res) => {
  console.log("req.Body", req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};


exports.login = (req, res) => {
  //find the user from mobile
  const { mobile, password } = req.body;
  User.findOne({ mobile }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that mobile no exist",
      });
    }

    if (!user.mobile_verified) {
      return res.status(400).json({
        error: "Your Mobile Number Not Verified!",
      });
    }

    //if user there match password and mobile
    //create auth method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Mobile and password does not match",
      });
    }
    //generate sign token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the token as t in cookie with expire date
    res.cookie("t", token, { expire: new Date() + 9999 });
    //return and response the user and the token to frontend

    const { _id, role, name, mobile,restaurant } = user;
    return res.json({
      token,
      user: {
        _id,
        name,
        mobile,
        role,
        restaurant,
      },
    });
  });
};

exports.forgotPasswordLogin = (req, res) => {
  //find the user from mobile
  const { mobile, newOtp } = req.body;
  User.findOne({ mobile }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that mobile no exist",
      });
    }

    if (!user.mobile_verified) {
      return res.status(400).json({
        error: "Your Mobile Number Not Verified!",
      });
    }

    //if user there match password and mobile
    //create auth method in user model
    if (user && newOtp !== user.otp) {
      return res.status(401).json({
        error: "Otp does not match",
      });
    }

    //generate sign token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the token as t in cookie with expire date
    res.cookie("t", token, { expire: new Date() + 9999 });
    //return and response the user and the token to frontend

    const { _id, role, name, mobile,restaurant } = user;
    return res.json({
      token,
      user: {
        _id,
        name,
        mobile,
        role,
        restaurant,
      },
    });
  });
};

exports.logout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Log Out Success" });
};

exports.requireLogin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};


exports.isAdmin = (req, res, next) => {
  if (req.profile.role !== 1) {
    return res.status(403).json({
      error: "Admin only! Access denied",
    });
  }
  next();
};

exports.isDesigner = (req, res, next) => {
  if (req.profile.role !== 2) {
    return res.status(403).json({
      error: "Admin only! Access denied",
    });
  }
  next();
};

exports.isDesignerOrAdmin = (req, res, next) => {
  if (req.profile.role === 2 || req.profile.role === 1 ) {
    next();
  }else{
    return res.status(403).json({
      error: "Admin & Designer only! Access denied",
    });
  }
  
};

exports.isDesignerOrAdminOrManager = (req, res, next) => {
  if (req.profile.role === 2 || req.profile.role === 1 || req.profile.role === 3) {
    next();
  }else{
    return res.status(403).json({
      error: "Admin,Manager & Designer only! Access denied",
    });
  }
  
};