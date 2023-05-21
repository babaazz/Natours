const Review = require("../models/Review");
const catchAsync = require("../utils/catchAsync");

const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "Success",
    data: {
      review: newReview,
    },
  });
});

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "Success",
    data: {
      reviews,
    },
  });
});

module.exports = {
  createReview,
  getAllReviews,
};
