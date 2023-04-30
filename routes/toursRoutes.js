const express = require("express");
const {
  getAllTours,
  getTourById,
  createTour,
  updateTourById,
  deleteTour,
  topFiveAlias,
  getToursStats,
} = require("../controllers/toursController");

const router = express.Router();

//Get all users
router.get("/", getAllTours);

//Get Tour Stats
router.get("/stats", getToursStats);

//Get top five tours (aliasing)
router.get("/topFive", topFiveAlias, getAllTours);

//Get Tour by Id
router.get("/:id", getTourById);

//Create New Tour
router.post("/", createTour);

//Update Tour
router.patch("/:id", updateTourById);

//Delete Tour
router.delete("/:id", deleteTour);

module.exports = router;
