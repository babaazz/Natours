const fs = require("fs/promises");
const path = require("path");

const data = {};
data.tours = require("../dev-data/data/tours.json");

const getAllTours = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: {
        tours: data.tours,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTourById = (req, res) => {
  try {
    const { id } = req.params;

    const tour = data.tours.find((t) => t._id === id);
    if (!tour) {
      res.status(404).json({
        status: "failed",
        message: "Tour doesn't exist",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTours, getTourById };
