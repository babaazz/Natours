const mongoose = require("mongoose");

const toursSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "A Tour must have a name"],
  },
  duration: {
    type: Number,
    required: [true, "A Tour must have certain duration"],
  },
  rating: {
    type: Number,
    default: 4.8,
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
});

const Tour = mongoose.model("tour", toursSchema);

module.exports = Tour;
