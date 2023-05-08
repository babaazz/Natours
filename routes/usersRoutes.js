const express = require("express");
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signUp", authController.SignUp);

router.post("/signIn", authController.signIn);

router.route("/").get(usersController.getAllUsers);

router
  .route("/:id")
  .get(usersController.getUserById)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
