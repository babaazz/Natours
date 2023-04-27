const mongoose = require("mongoose");

const toursSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "A Tour must have a name"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "A Tour must have certain duration"],
    },
    ratingAverage: {
      type: Number,
      default: 4.8,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Extreme"],
      default: "Easy",
    },
    price: {
      type: Number,
      required: [true, "A tour must declare certain price"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have group size limit"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      required: [true, "A tour must have a summary"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A tour must have description"],
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have an image cover"],
    },
    images: [String],
    startDates: [Date],
  },
  { timestamps: true }
);

const Tour = mongoose.model("tour", toursSchema);

module.exports = Tour;
