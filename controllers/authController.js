const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const Email = require("../utils/sendEmail");
const crypto = require("crypto");

const createJwtToken = (payLoad) => {
  return jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = createJwtToken({ id: user._id });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "Success",
    token,
    data: {
      user,
    },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, photo, role } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    photo,
    role,
  });

  try {
    const myEmail = new Email(
      newUser,
      `${req.protocol}://${req.get("host")}/me`
    );
    await myEmail.sendWelcome();
  } catch (error) {
    throw new AppError("There was an error sending email", 500);
  }

  createAndSendToken(newUser, 201, res);
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

  createAndSendToken(user, 200, res);
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Please provide email", 400);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new AppError("There is no user with this email", 404);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot password? Click the link below to reset your password. \n\n ${resetURL} \n\n Ignore this email if you haven't initiated password reset`;

  try {
    await new Email(user, resetURL).sendPasswordResetEmail();

    res.status(200).json({
      status: "Success",
      message: "Reset link has been send to your Email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    throw new AppError("There was an error sending the email", 500);
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError("Token is invalid or expired", 400);

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  createAndSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (!(oldPassword && newPassword && confirmNewPassword)) {
    throw new AppError("Please provide all the required fields", 400);
  }
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.passwordIsMatched(oldPassword, user.password))) {
    throw new AppError("Email or password is incorrect", 401);
  }
  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();

  createAndSendToken(user, 200, res);
});

const logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  };
  res.cookie("jwt", "logged out", cookieOptions);
  res.status(200).json({
    status: "Success",
    message: "User logged out successfully",
  });
};

module.exports = {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
};
