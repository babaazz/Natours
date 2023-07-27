const mongoose = require("mongoose");
const Tour = require("./Tour");

const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    tour: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "tour",
      required: [true, "review must belong to a tour"],
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: [true, "review must belong to a tour"],
    },
  },
  { timeStamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewsSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewsSchema.statics.calcAvgRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 4.5,
    });
  }
};

reviewsSchema.post("save", async function () {
  this.constructor.calcAvgRating(this.tour);
});

reviewsSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  }).populate({
    path: "tour",
    select: "name",
  });
  next();
});

reviewsSchema.pre(/^findOneAnd/, async function (next) {
  const queryclone = this.clone();
  this.rev = await queryclone.findOne();
  next();
});

reviewsSchema.post(/^findOneAnd/, async function () {
  this.rev.constructor.calcAvgRating(this.rev.tour);
});

const Review = mongoose.model("review", reviewsSchema);

module.exports = Review;
