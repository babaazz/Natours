const Tour = require("../models/Tour");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const controllersFactory = require("./controllersFactory");

const topFiveAlias = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getAllTours = controllersFactory.getAll(Tour);

const getTour = controllersFactory.getOne(Tour, { path: "reviews" });

const createTour = controllersFactory.createOne(Tour);

const updateTour = controllersFactory.updateOne(Tour);

const deleteTour = controllersFactory.deleteOne(Tour);

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
      $match: { _id: { $ne: "easy" } },
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

const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, coordinates, unit } = req.params;
  const [lat, lang] = coordinates.split(",");

  if (!lat || !lang) {
    throw new AppError(
      "Please provide latitude and longitude in the format lat, lang",
      400
    );
  }

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lang, lat], radius] } },
  });

  res.status(200).json({
    status: "Success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

const getToursDistances = catchAsync(async (req, res, next) => {
  const { coordinates, unit } = req.params;
  const [lat, lang] = coordinates.split(",");

  if (!lat || !lang) {
    throw new AppError(
      "Please provide coordinates in valid format. See documnetation for more info.",
      400
    );
  }

  const multiplier = unit === "mi" ? 0.000621371 : 0.0001;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lang * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "Success",
    results: distances.length,
    data: {
      distances,
    },
  });
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  topFiveAlias,
  getToursStats,
  getMonthlyStats,
  getToursWithin,
  getToursDistances,
};
