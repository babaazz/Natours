const express = require("express");
const {
  getAllTours,
  getTourById,
  createTour,
  updateTourById,
  deleteTour,
  topFiveAlias,
  getToursStats,
  getMonthlyStats,
} = require("../controllers/toursController");
const reviewsRouter = require("./reviewsRoutes");
const verifyToken = require("../middlewares/verifyToken");
const restrictActionTo = require("../middlewares/restrictActionTo");

const router = express.Router();

//Re-route review urls to review router
router.use("/:tourId/reviews", reviewsRouter);

//Get all users
router.get("/", verifyToken, getAllTours);

//Get Tour Stats
router.get("/stats", getToursStats);

//Get Monthly Stats
router.get("/getMonthlyStats/:year", getMonthlyStats);

//Get top five tours (aliasing)
router.get("/topFive", topFiveAlias, getAllTours);

//Get Tour by Id
router.get("/:id", getTourById);

//Create New Tour
router.post(
  "/",
  verifyToken,
  restrictActionTo("lead-guide", "admin"),
  createTour
);

//Update Tour
router.patch("/:id", updateTourById);

//Delete Tour
router.delete("/:id", deleteTour);

module.exports = router;
