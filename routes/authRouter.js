const express = require("express");

const authController = require("../controllers/authController");

const { isAuth, isGuest } = require("../middleware/protect");

const { checkRegister, checkLogin } = require("../validations/authValidation");

const router = express.Router();

router
  .route("/register")
  // "GET => /auth/register"
  .get(isGuest, authController.getRegister)
  // "POST => /auth/register"
  .post(isGuest, checkRegister, authController.postRegister);

router
  .route("/login")
  // "GET => /auth/login"
  .get(isGuest, authController.getLogin)
  // "POST => /auth/login"
  .post(isGuest, checkLogin, authController.postLogin);

router
  .route("/logout")
  // "DELETE => /auth/logout"
  .delete(isAuth, authController.deleteLogout);

module.exports = router;
