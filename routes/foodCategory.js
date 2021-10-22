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
  foodCategoryById,
  read,
  update,
  photo1,
  photo2,
  homeFoodCategory,
  adminFoodCategoryList,
  remove
} = require("../controllers/foodCategory");
router.param("foodCategoryId", foodCategoryById);
router.get("/foodCategory/:foodCategoryId", read);
router.post(
  "/foodCategory/create/:userId",
  requireLogin,
  isAuth,
  isDesigner,
  create
);


router.put(
  "/foodCategory/:foodCategoryId/:userId",
  requireLogin,
  isDesigner,
  isAuth,
  update
);
router.get("/home/foodCategories", homeFoodCategory);
router.get("/admin/foodCategories", adminFoodCategoryList);
router.get("/foodCategory/photo1/:foodCategoryId/", photo1);
router.get("/foodCategory/photo2/:foodCategoryId/", photo2);
router.delete(
  "/foodCategory/:foodCategoryId/:userId",
  requireLogin,
  isDesigner,
  isAuth,
  remove
);
module.exports = router;