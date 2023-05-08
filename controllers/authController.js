const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const createJwtToken = (payLoad) => {
  return jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const SignUp = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, photo, passwordChangedAt } =
    req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    photo,
    passwordChangedAt,
  });
  const accessToken = createJwtToken({ id: newUser._id });
  newUser.password = undefined;
  newUser.confirmPassword = undefined;
  res.status(201).json({
    status: "Success",
    token: accessToken,
    data: {
      newUser,
    },
  });
});

const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.passwordIsMatched(password, user.password))) {
    throw new AppError("Email or password is incorrect", 401);
  }

  const accessToken = createJwtToken({ id: user._id });

  res.status(200).json({
    status: "Success",
    accessToken,
  });
});

module.exports = { SignUp, signIn };
