const mongoose = require("mongoose");
const Tour = require("../models/Tour");
const APIFeatures = require("../utils/apiFeatures");

const topFiveAlias = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getAllTours = async (req, res) => {
  try {
    const query = Tour.find();
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query.exec();

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTourById = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findById(id);
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
    res.status(400).json({ message: error.message });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create({
      ...req.body,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
      message: "New Tour has been created",
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const updateTourById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: updatedTour,
      },
      message: "Tour has been updated",
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: "Success",
      message: `tour has been deleted`,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numOfRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      {
        $match: { _id: { $ne: "Easy" } },
      },
    ]);

    res.status(200).json({
      status: "Success",
      results: stats.length,
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const getMonthlyStats = async (req, res) => {
  try {
    const year = req.params.year;
    const monthlyStats = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numOfTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: {
          numOfTourStarts: -1,
        },
      },
    ]);

    res.status(200).json({
      status: "Success",
      results: monthlyStats.length,
      data: {
        monthlyStats,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTourById,
  deleteTour,
  topFiveAlias,
  getToursStats,
  getMonthlyStats,
};
