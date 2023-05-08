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

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    name: err.name,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "fail",
      message: "Opps something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const errorLogMessage = `${err.statusCode}\t ${err.message}`;
  logEvents(errorLogMessage, "errorLog.txt");

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.create(err, Object.getOwnPropertyDescriptors(err));
    console.log(error.name);
    if (error.name === "CastError") error = handleDBCastErr(error);
    if (error.code === 11000) error = handleDuplicateErr(error);
    if (error.name === "ValidationError") error = handeleValidationErr(error);
    sendErrorProd(error, res);
  }
};
