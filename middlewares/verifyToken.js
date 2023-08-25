const User = require("../models/User");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const verifyToken = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const cookies = req.cookies;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (cookies.jwt) {
    token = cookies.jwt;
  } else {
    throw new AppError("User not logged in.", 401);
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    throw new AppError(
      "The user belonging to this token does no longer exist",
      401
    );
  }

  if (currentUser.isPasswordChangedAfterLastLogin(decoded.iat)) {
    throw new AppError(
      "Password has been changed since last login. Please login with new password",
      401
    );
  }

  req.user = currentUser;

  next();
});

module.exports = verifyToken;
