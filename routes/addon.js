const express = require("express");
const {
  addonById,
  read,
  update,
  remove,
  addonByRole,
  create,
  changeAvailable,
  list,
} = require("../controllers/addon");

const {
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  isDesignerOrAdminOrManager,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();

router.param("addonId", addonById);
router.param("userId", userById);

router.get("/addon/:addonId", read);
router.post(
  "/addon/create/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  create
);
router.put(
  "/addon/:addonId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdminOrManager,
  update
);
router.delete(
  "/addon/:addonId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  remove
  
);
router.post("/addons", addonByRole);

router.post(
  "/addon/changeAvailable/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdminOrManager,
  changeAvailable
);

router.get("/allAddons", list);

module.exports = router;
