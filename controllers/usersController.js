const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) filteredObj[el] = obj[el];
  });
  return filteredObj;
};

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    throw new AppError("This isn't route for password change", 400);
  }

  const filteredBody = filterObj(req.body, "name", "email", "photo");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "Success",
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.sendStatus(204);
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "Success",
    data: {
      users,
    },
  });
});

const getUserById = (req, res) => {
  res.status(200).json({
    status: "Success",
    data: {
      message: "This route is under construction",
    },
  });
};

const updateUser = (req, res) => {
  res.status(200).json({
    status: "Success",
    data: {
      message: "This route is under construction",
    },
  });
};

const deleteUser = (req, res) => {
  res.status(200).json({
    status: "Success",
    data: {
      message: "This route is under construction",
    },
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};
