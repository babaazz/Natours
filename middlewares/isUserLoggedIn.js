const User = require("../models/User");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const isUserLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET
      );

      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        next();
      }

      if (currentUser.isPasswordChangedAfterLastLogin(decoded.iat)) {
        next();
      }
      res.locals.user = currentUser;
    } catch (error) {
      return next();
    }
  }
  next();
};

module.exports = isUserLoggedIn;
