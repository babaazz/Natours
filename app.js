const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const { logger } = require("./middlewares/logger");

const toursRouter = require("./routes/toursRoutes");
const usersRouter = require("./routes/usersRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

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

//Routes
//Tours Routes
app.use("/api/v1/tours", toursRouter);

//User Routes
app.use("/api/v1/users", usersRouter);

//Unhandled Routes
app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

//Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
