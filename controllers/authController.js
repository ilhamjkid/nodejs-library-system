const User = require("../models/User");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { NODE_ENV, SECRET_TOKEN, EXPIRES_JWT, MAX_AGE_COOKIE } = process.env;

/**
 * @desc    Get Register Page
 * @route   GET "/auth/register"
 * @access  Public
 */
exports.getRegister = (req, res, next) => {
  let message = null;
  const errorMessage = req.flash("error")[0];
  const successMessage = req.flash("success")[0];
  if (errorMessage) {
    message = { status: false, value: errorMessage };
  } else if (successMessage) {
    message = { status: true, value: successMessage };
  }
  res.status(200).render("auth/register", {
    layout: "layouts/main",
    pageTitle: "Daftar",
    path: "/auth/register",
    message,
    value: null,
    errors: null,
  });
};

/**
 * @desc    Handling Register
 * @route   POST "/auth/register"
 * @access  Public
 */
exports.postRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/register", {
      layout: "layouts/main",
      pageTitle: "Daftar",
      path: "/auth/register",
      message: { status: false, value: "Gagal daftar. Silahkan coba lagi!" },
      value: { name, email: email === "@" ? "" : email, password: null },
      errors: errors.mapped(),
    });
  }
  bcrypt
    .hash(password, 12)
    .then((pwHash) => {
      return User.create({
        name,
        email,
        password: pwHash,
        secretToken: null,
        isAdmin: false,
      }).then(() => {
        req.flash("success", "Berhasil mendaftar. Silahkan login!");
        return res.redirect("/auth/login");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

/**
 * @desc    Get Login Page
 * @route   GET "/auth/login"
 * @access  Public
 */
exports.getLogin = (req, res, next) => {
  let message = null;
  const errorMessage = req.flash("error")[0];
  const successMessage = req.flash("success")[0];
  if (errorMessage) {
    message = { status: false, value: errorMessage };
  } else if (successMessage) {
    message = { status: true, value: successMessage };
  }
  res.status(200).render("auth/login", {
    layout: "layouts/main",
    pageTitle: "Masuk",
    path: "/auth/login",
    message,
    value: null,
    errors: null,
  });
};

/**
 * @desc    Handling Login
 * @route   POST "/auth/login"
 * @access  Public
 */
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      layout: "layouts/main",
      pageTitle: "Masuk",
      path: "/auth/login",
      message: { status: false, value: "Gagal masuk. Silahkan coba lagi!" },
      value: { email: email === "@" ? "" : email, password: null },
      errors: errors.mapped(),
    });
  }
  let secretToken;
  User.findOne({ email })
    .then((user) => {
      bcrypt.compare(password, user.password).then((pwMatch) => {
        if (!pwMatch) {
          const emailPw = "Email atau Password salah!";
          return res.status(422).render("auth/login", {
            layout: "layouts/main",
            pageTitle: "Masuk",
            path: "/auth/login",
            message: { status: false, value: "Gagal masuk. Silahkan coba lagi!" },
            value: { email: email === "@" ? "" : email, password: null },
            errors: { email: { msg: emailPw }, password: { msg: emailPw } },
          });
        }
        secretToken = jwt.sign(
          {
            name: user.name,
            email: user.email,
          },
          SECRET_TOKEN,
          { expiresIn: EXPIRES_JWT }
        );
        user.secretToken = secretToken;
        return user.save().then((user) => {
          res.cookie("secretToken", secretToken, {
            httpOnly: true,
            maxAge: parseInt(MAX_AGE_COOKIE),
            secure: NODE_ENV !== "production" ? false : true,
          });
          if (!user.isAdmin) {
            req.flash("success", "Berhasil masuk. Silahkan meminjam!");
            return res.redirect("/");
          } else {
            req.flash("success", "Berhasil masuk. Silahkan mengelola perpus!");
            return res.redirect("/admin/borrowers");
          }
        });
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

/**
 * @desc    Handling Logout
 * @route   DELETE "/auth/logout"
 * @access  Private
 */
exports.deleteLogout = (req, res, next) => {
  User.updateOne({ _id: req.user._id }, { secretToken: null })
    .then(() => {
      req.flash("success", "Berhasil keluar. Selamat tinggal!");
      res.clearCookie("secretToken");
      res.redirect("/auth/register");
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};
