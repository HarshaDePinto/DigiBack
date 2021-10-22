const express = require("express");
const {
  create,
  mainSlideById,
  read,
  remove,
  update,
  photo,
  list,
  frontSlide,
} = require("../controllers/mainSlider");
const { userById } = require("../controllers/user");
const {
  requireLogin,
  isAuth,
  isDesigner,
} = require("../controllers/auth");
const router = express.Router();

router.param("userId", userById);
router.param("mainSlideId", mainSlideById);

router.get("/mainSlide/:mainSlideId", read);
router.post(
  "/mainSlider/create/:userId",
  requireLogin,
  isAuth,
  isDesigner,
  create
);

router.delete(
  "/mainSlide/:mainSlideId/:userId",
  requireLogin,
  isAuth,
  isDesigner,
  remove
);
router.put(
  "/mainSlide/:mainSlideId/:userId",
  requireLogin,
  isAuth,
  isDesigner,
  update
);
router.get("/mainSlides", list);
router.get("/frontSlides", frontSlide);
router.get("/mainSlide/photo/:mainSlideId/", photo);
module.exports = router;
