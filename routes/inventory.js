const express = require("express");
const {
  inventoryById,
  read,
  update,
  remove,
  create,
  list,
  inventoryByCode,
} = require("../controllers/inventory");

const {
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  isDesignerOrAdminOrManager,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();

router.param("inventoryId", inventoryById);
router.param("userId", userById);

router.get("/inventory/:inventoryId", read);
router.post(
  "/inventory/create/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  create
);
router.put(
  "/inventory/:inventoryId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdminOrManager,
  update
);
router.delete(
  "/inventory/:inventoryId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  remove
);


router.get("/inventories", list);

router.post("/client/promo", inventoryByCode);
module.exports = router;

