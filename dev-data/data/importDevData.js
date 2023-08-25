const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/Tour");
const User = require("../../models/User");
const Review = require("../../models/Review");

dotenv.config();

//Config
//For Mongo Atlas Connection
// const dbUri = process.env.DATABASE_URI.replace(
//   "<password>",
//   process.env.DATABASE_PASSWORD
// );

//For Local Database connection
const dbUri = process.env.LOCAL_DATABASE_URI;

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tours.json"), "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, "users.json"), "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, "reviews.json"), "utf-8")
);

const addDataToDB = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data succesfully loaded");
  } catch (error) {
    console.error(error.message);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data deleted");
  } catch (error) {
    console.error(error.message);
  }
};

//Database Connection
mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
    (async () => {
      if (process.argv[2] === "--add") {
        await addDataToDB();
      } else if (process.argv[2] === "--delete") {
        await deleteData();
      } else {
        console.log("Please specify arguments");
      }
      process.exit();
    })();
  })
  .catch(() => {
    console.error("Ooops something went wrong");
  });
