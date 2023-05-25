const express = require("express");
const reviewsController = require("../controllers/reviewsController");
const verifyToken = require("../middlewares/verifyToken");
const restrictActionTo = require("../middlewares/restrictActionTo");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewsController.getAllReviews)
  .post(
    verifyToken,
    restrictActionTo("user"),
    reviewsController.setTourAndUserIds,
    reviewsController.createReview
  );

router
  .route("/:id")
  .get(reviewsController.getReview)
  .patch(verifyToken, restrictActionTo("user"), reviewsController.updateReview)
  .delete(
    verifyToken,
    restrictActionTo("user"),
    reviewsController.deleteReview
  );

module.exports = router;
