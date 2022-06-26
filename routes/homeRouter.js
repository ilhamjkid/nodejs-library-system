const express = require("express");

const homeController = require("../controllers/homeController");

const { isAuth, isNotAdmin } = require("../middleware/protect");

const router = express.Router();

// "GET => /"
router.get("/", isAuth, isNotAdmin, homeController.getIndex);
// "GET => /loans"
router.get("/loans", isAuth, isNotAdmin, homeController.getLoan);
// "GET => /profile"
router.get("/profiles", isAuth, isNotAdmin, homeController.getProfile);

module.exports = router;
