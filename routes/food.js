const express = require("express");
const {
  foodById,
  read,
  update,
  remove,
  create,
  foodByCategory,
  photo,
  list,
  changeAvailable,
} = require("../controllers/food");
const { foodCategoryById } = require("../controllers/foodCategory");

const {
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  isDesignerOrAdminOrManager,
} = require("../controllers/auth");

const { userById } = require("../controllers/user");
const router = express.Router();

router.param("foodId", foodById);
router.param("userId", userById);
router.param("foodCategoryId", foodCategoryById);

router.get("/food/:foodId", read);
router.post(
  "/food/create/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  create
);

router.put(
  "/food/:foodId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  update
);
router.delete(
  "/food/:foodId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  remove
);
router.get("/foodByCategory/:foodCategoryId",foodCategoryById, foodByCategory);
router.get("/food/photo/:foodId/", photo);
router.get("/foods", list);
router.post(
  "/food/changeAvailable/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdminOrManager,
  changeAvailable
);
module.exports = router;
