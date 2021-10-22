const express = require("express");
const { userById } = require("../controllers/user");
const { requireLogin, isAuth ,isAdmin} = require("../controllers/auth");

const router = express.Router();
router.param("userId", userById);
const {
  create,
  read,
  recodeById,
  remove,
  recodeByDateRange,
} = require("../controllers/recode");

router.param("recodeId", recodeById);
router.get("/recode/:recodeId", read);
router.post("/recode/create/:userId", requireLogin, isAuth, create);
router.post("/recode/byDate/:userId", requireLogin, isAuth, recodeByDateRange);
router.delete(
    "/recode/:recodeId/:userId",
    requireLogin,
    isAuth,
    isAdmin,
    remove
  );
module.exports = router;
