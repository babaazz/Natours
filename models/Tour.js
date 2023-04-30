const mongoose = require("mongoose");
const slugify = require("slugify");

const toursSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "A Tour must have a name"],
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A Tour must have certain duration"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.8,
    },
    ratingsQuantity: {
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
    secretTour: Boolean,
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

toursSchema.virtual("durationWeeks").get(function () {
  return `${Math.floor(this.duration / 7)} weeks and ${this.duration % 7} days`;
});

toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

toursSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("tour", toursSchema);

module.exports = Tour;
