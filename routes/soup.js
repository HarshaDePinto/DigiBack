const express = require("express");
const {
  soupById,
  read,
  update,
  remove,
  create,
  photo,
  list,
  changeAvailable,
} = require("../controllers/soup");

const {
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  isDesignerOrAdminOrManager,
} = require("../controllers/auth");

const { userById } = require("../controllers/user");
const router = express.Router();

router.param("soupId", soupById);
router.param("userId", userById);

router.get("/soup/:soupId", read);
router.post(
  "/soup/create/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  create
);

router.put(
  "/soup/:soupId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  update
);
router.delete(
  "/soup/:soupId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  remove
);

router.get("/soup/photo/:soupId/", photo);
router.get("/soups", list);
router.post(
  "/soup/changeAvailable/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdminOrManager,
  changeAvailable
);
module.exports = router;
