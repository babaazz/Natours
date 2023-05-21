const express = require("express");
const reviewsController = require("../controllers/reviewsController");
const verifyToken = require("../middlewares/verifyToken");
const restrictActionTo = require("../middlewares/restrictActionTo");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewsController.getAllReviews)
  .post(verifyToken, restrictActionTo("user"), reviewsController.createReview);

module.exports = router;
