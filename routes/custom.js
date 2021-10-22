const express = require("express");
const {
  customById,
  read,
  update,
  remove,
  create,
  photo,
  list,
} = require("../controllers/custom");

const {
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  isDesignerOrAdminOrManager,
} = require("../controllers/auth");

const { userById } = require("../controllers/user");
const router = express.Router();

router.param("customId", customById);
router.param("userId", userById);

router.get("/custom/:customId", read);
router.post(
  "/custom/create/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  create
);

router.put(
  "/custom/:customId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  update
);
router.delete(
  "/custom/:customId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  remove
);

router.get("/custom/photo/:customId/", photo);
router.get("/customs", list);

module.exports = router;
