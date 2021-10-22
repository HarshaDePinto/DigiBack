const express = require("express");
const {
  restaurantById,
  read,
  update,
  remove,
  list,
  create,
} = require("../controllers/restaurant");

const {
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();

router.param("restaurantId", restaurantById);
router.param("userId", userById);

router.get("/restaurant/:restaurantId", read);
router.post(
  "/restaurant/create/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  create
);
router.put(
  "/restaurant/:restaurantId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  update
);
router.delete(
  "/restaurant/:restaurantId/:userId",
  requireLogin,
  isAuth,
  isDesignerOrAdmin,
  remove
);
router.get("/restaurants", list);

module.exports = router;
