const AppError = require("../utils/appError");
const { logEvents } = require("./logger");

const handleDBCastErr = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErr = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate Field value ${value} . Please use another`;
  return new AppError(message, 400);
};

const handeleValidationErr = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleTokenExpiredErr = () =>
  new AppError("Loging Expired!! Please login again", 401);

const handleInvalidTokenErr = () =>
  new AppError("Invalid Token !! Please login again", 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render("error", {
    title: "Ooops something went wrong",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(500).json({
      status: err.status,
      message: "Opps something went wrong",
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Ooops something went wrong",
      msg: err.message,
    });
  }
  return res.status(500).render("error", {
    title: "Something went wrong",
    msg: "Please try again",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const errorLogMessage = `${err.statusCode}\t ${err.message}`;
  logEvents(errorLogMessage, "errorLog.txt");

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.create(err, Object.getOwnPropertyDescriptors(err));

    if (error.name === "CastError") error = handleDBCastErr(error);
    if (error.code === 11000) error = handleDuplicateErr(error);
    if (error.name === "ValidationError") error = handeleValidationErr(error);
    if (error.name === "JsonWebTokenError") error = handleInvalidTokenErr();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredErr();

    sendErrorProd(error, req, res);
  }
};
