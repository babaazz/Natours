const express = require("express");
const viewsController = require("../controllers/viewsController");
const isUserLoggedIn = require("../middlewares/isUserLoggedIn");

const router = express.Router();

router.use(isUserLoggedIn);

router.get("/", viewsController.getOverview);

router.get("/tour/:slug", viewsController.getTour);

router.get("/login", viewsController.login);

module.exports = router;
