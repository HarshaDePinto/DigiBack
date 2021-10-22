const express = require("express");
const { userById } = require("../controllers/user");
const { restaurantById } = require("../controllers/restaurant");
const { requireLogin, isAuth,isAdmin } = require("../controllers/auth");

const router = express.Router();
router.param("userId", userById);
const {
  create,
  read,
  invoiceById,
  onGoingOrders,
  onGoingOrdersNumber,
  onGoingOrdersClient,
  onGoingOrdersClientNumber,
  updateStatus,
  isOrderSubmit,
  onGoingOrdersNumberRestaurant,
  onGoingOrdersRestaurant,
  acceptedOrdersRestaurant,
  orderDelivered,
  invoicesByDateRange,
  remove,
  createByManager,
  notify,
} = require("../controllers/invoice");

router.param("invoiceId", invoiceById);
router.param("restaurantId", restaurantById);
router.get("/invoice/:invoiceId", read);
router.post("/invoice/create/:userId", requireLogin, isAuth, create);
router.get("/ongoing/invoices", onGoingOrders);
router.get("/ongoing/number", onGoingOrdersNumber);
router.get("/ongoing/client/:userId", onGoingOrdersClient);
router.get("/ongoing/number/client/:userId", onGoingOrdersClientNumber);
router.get("/ongoing/submit/:userId", isOrderSubmit);
router.put("/invoice/status/:invoiceId", updateStatus);
router.get("/restaurant/ongoingOrdersNumber/:restaurantId", onGoingOrdersNumberRestaurant);
router.get("/restaurant/ongoingOrders/:restaurantId", onGoingOrdersRestaurant);
router.get("/restaurant/acceptedOrders/:restaurantId", acceptedOrdersRestaurant);
router.put("/invoice/delivered/:invoiceId", orderDelivered);
router.post("/invoices/byDate/:userId", requireLogin, isAuth, invoicesByDateRange);
router.delete(
  "/invoice/:invoiceId/:userId",
  requireLogin,
  isAuth,
  isAdmin,
  remove
);
router.post("/invoice/createByManager/:userId", requireLogin, isAuth, createByManager);
router.post("/notify", notify);

module.exports = router;
