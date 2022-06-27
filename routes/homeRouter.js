const express = require("express");

const homeController = require("../controllers/homeController");

const { isAuth, isNotAdmin } = require("../middleware/protect");

const { checkUpdateProfile } = require("../validations/homeValidation");

const router = express.Router();

// "GET => /"
router.get("/", isAuth, isNotAdmin, homeController.getIndex);
// "GET => /loans"
router.get("/loans", isAuth, isNotAdmin, homeController.getLoan);

router
  .route("/profiles")
  // "GET => /profiles"
  .get(isAuth, isNotAdmin, homeController.getProfile)
  // "PUT => /profiles"
  .put(isAuth, isNotAdmin, checkUpdateProfile, homeController.putProfile);

module.exports = router;
