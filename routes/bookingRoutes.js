const express = require("express");
const bookingController = require("../controllers/bookingController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.get(
  "/checkout-session/:tourId",
  verifyToken,
  bookingController.getCheckoutSession
);

module.exports = router;
