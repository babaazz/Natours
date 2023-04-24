const express = require("express");
const { getAllTours, getTourById } = require("../controller/toursController");

const router = express.Router();

//Get all users
router.get("/", getAllTours);

//Get Tour by Id
router.get("/:id", getTourById);

module.exports = router;
