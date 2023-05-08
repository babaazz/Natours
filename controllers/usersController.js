const User = require("../models/User");

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "Success",
    data: {
      message: "This route is under construction",
    },
  });
};

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

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
