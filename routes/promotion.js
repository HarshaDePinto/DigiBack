const express = require("express");
const {
  promotionById,
  read,
  update,
  remove,
  create,
  list,
  promotionByCode,
} = require("../controllers/promotion");

const {
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  isDesignerOrAdminOrManager,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();

router.param("promotionId", promotionById);
router.param("userId", userById);

router.get("/promotion/:promotionId", read);
router.post(
  "/promotion/create/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  create
);
router.put(
  "/promotion/:promotionId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdminOrManager,
  update
);
router.delete(
  "/promotion/:promotionId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  remove
);


router.get("/promotions", list);

router.post("/client/promo", promotionByCode);
module.exports = router;
