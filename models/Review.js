const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
      min: 10,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    tour: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "tour",
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timeStamps: true }
);

const Review = mongoose.model("review", reviewsSchema);

module.exports = Review;
