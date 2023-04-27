const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const { logger } = require("./middleware/logger");
const toursRouter = require("./routes/toursRoutes");

//Configuration

const app = express();

//Middlewares
app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.route("/").get((req, res) => {
  res.status(200).send("Hello world");
});

app.use("/tours", toursRouter);

module.exports = app;
