const express = require("express");
const {
  saladById,
  read,
  update,
  remove,
  create,
  saladByCategory,
  photo,
  list,
  changeAvailable,
} = require("../controllers/salad");
const { saladCategoryById } = require("../controllers/saladCategory");

const {
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  isDesignerOrAdminOrManager,
} = require("../controllers/auth");

const { userById } = require("../controllers/user");
const router = express.Router();

router.param("saladId", saladById);
router.param("userId", userById);
router.param("saladCategoryId", saladCategoryById);

router.get("/salad/:saladId", read);
router.post(
  "/salad/create/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  create
);

router.put(
  "/salad/:saladId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  update
);
router.delete(
  "/salad/:saladId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  remove
);
router.get("/saladByCategory/:saladCategoryId",saladCategoryById, saladByCategory);
router.get("/salad/photo/:saladId/", photo);
router.get("/salads", list);
router.post(
  "/salad/changeAvailable/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdminOrManager,
  changeAvailable
);
module.exports = router;
