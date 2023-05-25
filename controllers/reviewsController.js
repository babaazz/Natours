const Review = require("../models/Review");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const controllersFactory = require("./controllersFactory");

const setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const createReview = controllersFactory.createOne(Review);

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const query = Review.find(filter);
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query.exec();

  res.status(200).json({
    status: "Success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const getReview = controllersFactory.getOne(Review);

const updateReview = controllersFactory.updateOne(Review);

const deleteReview = controllersFactory.deleteOne(Review);

module.exports = {
  setTourAndUserIds,
  createReview,
  getAllReviews,
  getReview,
  deleteReview,
  updateReview,
};
