const express = require("express");
const router = express.Router();
const { register, login, logout,forgotPasswordLogin } = require("../controllers/auth");
const { userSignupValidator } = require("../validator/index");

router.post("/register", userSignupValidator, register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPasswordLogin", forgotPasswordLogin);
module.exports = router;
