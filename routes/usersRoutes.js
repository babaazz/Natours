const express = require("express");
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");
const restrictActionTo = require("../middlewares/restrictActionTo");

const router = express.Router();

router.post("/signUp", authController.signUp);

router.post("/signIn", authController.signIn);

router.patch("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/updatePassword", verifyToken, authController.updatePassword);

router.use(verifyToken);

router.get("/me", usersController.getMe, usersController.getUser);

router.patch("/updateMe", usersController.updateMe);

router.delete("/deleteMe", usersController.deleteMe);

router.use(restrictActionTo("admin"));

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router
  .route("/:id")
  .get(verifyToken, usersController.getUser)
  .patch(verifyToken, restrictActionTo("admin"), usersController.updateUser)
  .delete(verifyToken, restrictActionTo("admin"), usersController.deleteUser);

module.exports = router;
