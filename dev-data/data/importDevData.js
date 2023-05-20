const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/Tour");

dotenv.config();
console.log(process.env.DATABASE_URI);

//Config

const dbUri = process.env.DATABASE_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tours.json"), "utf-8")
);

const addDataToDB = async () => {
  try {
    await Tour.create(data);
    console.log("Data succesfully loaded");
  } catch (error) {
    console.error(error.message);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
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
