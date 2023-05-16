const AppError = require("../utils/appError");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "You don't have permission to perform this action",
        403
      );
    }
    next();
  };
};
