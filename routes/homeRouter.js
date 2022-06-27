const express = require("express");

const homeController = require("../controllers/homeController");

const { isAuth, isNotAdmin } = require("../middleware/protect");

const { checkUpdateProfile } = require("../validations/homeValidation");

const router = express.Router();

router
  .route("/")
  // "GET => /"
  .get(isAuth, isNotAdmin, homeController.getIndex);

router
  .route("/loans")
  // "GET => /loans"
  .get(isAuth, isNotAdmin, homeController.getLoan)
  // "POST => /loans"
  .post(isAuth, isNotAdmin, homeController.postLoan);

router
  .route("/profiles")
  // "GET => /profiles"
  .get(isAuth, isNotAdmin, homeController.getProfile)
  // "PUT => /profiles"
  .put(isAuth, isNotAdmin, checkUpdateProfile, homeController.putProfile);

module.exports = router;
