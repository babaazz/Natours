const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const { logger } = require("./middlewares/logger");

const toursRouter = require("./routes/toursRoutes");
const usersRouter = require("./routes/usersRoutes");
const reviewsRouter = require("./routes/reviewsRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

//Configuration

const app = express();

// GlobalMiddlewares

// Middleware for logging request data
app.use(logger);

// Middleware for writing security http headers
app.use(helmet());

// Middlewares for parsing request object
app.use(express.json());
app.use(cookieParser());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

//Middleware for data sanitization against NoSQL injection attack
app.use(mongoSanitize());

//Middleware for data sanitization against XSS attack
app.use(xss());

//Prevent Parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "price",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

//Rate Limiter Middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP. Please try after sometime",
});

// Cors Middleware
app.use(cors());

// Middleware for setting up static resource destination
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use("/api", limiter);
//Routes
//Tours Routes
app.use("/api/v1/tours", toursRouter);

//User Routes
app.use("/api/v1/users", usersRouter);

//Reviews Routes
app.use("/api/v1/reviews", reviewsRouter);

//Unhandled Routes
app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

//Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
