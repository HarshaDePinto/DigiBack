const express = require("express");
const {
  userById,
  read,
  update,
  userByMobile,
  verifyUserMobile,
  resend,
  userByRole,
  singleUpdate,
  singleById,
  removeSingle,
} = require("../controllers/user");
const { requireLogin, isAuth, isAdmin } = require("../controllers/auth");
const router = express.Router();

router.param("userId", userById);
router.param("singleId", singleById);
router.param("userMobile", userByMobile);

router.get("/user/:userId", read);
router.get("/user/mobile/:userMobile", read);
router.put("/user/:userId", requireLogin, isAuth, update);
router.post("/mobile/verify/:userId", verifyUserMobile);
router.post("/mobile/resend/:userId", resend);
router.post("/user/by/role", userByRole, requireLogin, isAuth);
router.put("/user/:userId", requireLogin, isAuth, update);
router.put(
  "/single/:singleId/:userId",
  requireLogin,
  isAuth,
  isAdmin,
  singleUpdate
);

router.delete(
  "/single/:singleId/:userId",
  requireLogin,
  isAuth,
  isAdmin,
  removeSingle
);

module.exports = router;
