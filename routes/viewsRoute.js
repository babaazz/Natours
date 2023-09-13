const express = require("express");
const viewsController = require("../controllers/viewsController");
const isUserLoggedIn = require("../middlewares/isUserLoggedIn");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", isUserLoggedIn, viewsController.getOverview);

router.get("/tour/:slug", isUserLoggedIn, viewsController.getTour);

router.get("/login", isUserLoggedIn, viewsController.login);

router.get("/me", verifyToken, viewsController.getAccount);

router.post("/submit-user-data", verifyToken, viewsController.updateUserData);

module.exports = router;
