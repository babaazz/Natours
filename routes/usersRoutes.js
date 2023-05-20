const express = require("express");
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/signUp", authController.signUp);

router.post("/signIn", authController.signIn);

router.patch("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/updatePassword", verifyToken, authController.updatePassword);

router.patch("/updateMe", verifyToken, usersController.updateMe);

router.delete("/deleteMe", verifyToken, usersController.deleteMe);

router.route("/").get(verifyToken, usersController.getAllUsers);

router
  .route("/:id")
  .get(usersController.getUserById)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
