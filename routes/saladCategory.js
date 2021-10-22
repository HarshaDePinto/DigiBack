const express = require("express");
const { userById } = require("../controllers/user");
const {
  requireLogin,
  isAuth,
  isDesigner,
} = require("../controllers/auth");

const router = express.Router();
router.param("userId", userById);
const {
  create,
  saladCategoryById,
  read,
  update,
  photo1,
  photo2,
  homeSaladCategory,
  adminSaladCategoryList,
  remove
} = require("../controllers/saladCategory");
router.param("saladCategoryId", saladCategoryById);
router.get("/saladCategory/:saladCategoryId", read);
router.post(
  "/saladCategory/create/:userId",
  requireLogin,
  isAuth,
  isDesigner,
  create
);


router.put(
  "/saladCategory/:saladCategoryId/:userId",
  requireLogin,
  isDesigner,
  isAuth,
  update
);
router.get("/home/saladCategories", homeSaladCategory);
router.get("/admin/saladCategories", adminSaladCategoryList);
router.get("/saladCategory/photo1/:saladCategoryId/", photo1);
router.get("/saladCategory/photo2/:saladCategoryId/", photo2);
router.delete(
  "/saladCategory/:saladCategoryId/:userId",
  requireLogin,
  isDesigner,
  isAuth,
  remove
);
module.exports = router;