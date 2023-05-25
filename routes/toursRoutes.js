const express = require("express");
const toursController = require("../controllers/toursController");
const reviewsRouter = require("./reviewsRoutes");
const verifyToken = require("../middlewares/verifyToken");
const restrictActionTo = require("../middlewares/restrictActionTo");

const router = express.Router();

//Re-route review urls to review router
router.use("/:tourId/reviews", reviewsRouter);

//Get all tours
router.get("/", toursController.getAllTours);

//Get top five tours (aliasing)
router.get(
  "/topFive",
  toursController.topFiveAlias,
  toursController.getAllTours
);

//Get tours within a radius
router.get(
  "/getToursWithin/:distance/center/:coordinates/unit/:unit",
  toursController.getToursWithin
);

//Get distances of all tours
router.get(
  "/distances/:coordinates/unit/:unit",
  toursController.getToursDistances
);

//Get Tour Stats
router.get("/stats", toursController.getToursStats);

//Get Monthly Stats
router.get(
  "/getMonthlyStats/:year",
  verifyToken,
  restrictActionTo("admin", "lead-guide", "guide"),
  toursController.getMonthlyStats
);

//Create New Tour
router.post(
  "/",
  verifyToken,
  restrictActionTo("lead-guide", "admin"),
  toursController.createTour
);

//Read update and delete Tour by Id
router
  .route("/:id")
  .get(toursController.getTour)
  .patch(
    verifyToken,
    restrictActionTo("lead-guide", "admin"),
    toursController.updateTour
  )
  .delete(
    verifyToken,
    restrictActionTo("lead-guide", "admin"),
    toursController.deleteTour
  );

module.exports = router;
