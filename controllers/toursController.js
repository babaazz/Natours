const mongoose = require("mongoose");
const Tour = require("../models/Tour");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const topFiveAlias = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
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
});

const getTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);
  if (!tour) {
    throw new AppError(`No tour found with id ${id}!!`, 404);
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create({
    ...req.body,
  });
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
    message: "New Tour has been created",
  });
});

const updateTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) {
    throw new AppError(`No tour found with id ${id}!!`, 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: updatedTour,
    },
    message: "Tour has been updated",
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedTour = await Tour.findByIdAndDelete(id);

  if (!deletedTour) {
    throw new AppError(`No tour found with id ${id}!!`, 404);
  }

  res.status(204).json({
    status: "Success",
    message: `tour has been deleted`,
  });
});

const getToursStats = catchAsync(async (req, res, next) => {
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
});

const getMonthlyStats = catchAsync(async (req, res, next) => {
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
});

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
