const User = require("../models/User");

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const { NODE_ENV, SECRET_TOKEN, EXPIRES_JWT, MAX_AGE_COOKIE } = process.env;

/**
 * @desc    Get Index Page
 * @route   GET "/"
 * @access  Private
 */
exports.getIndex = (req, res, next) => {
  res.status(200).render("home/index", {
    layout: "layouts/main",
    pageTitle: "Daftar Buku",
    path: "/",
  });
};

/**
 * @desc    Get Loan Page
 * @route   GET "/loans"
 * @access  Private
 */
exports.getLoan = (req, res, next) => {
  res.status(200).render("home/loan", {
    layout: "layouts/main",
    pageTitle: "Buku Dipinjam",
    path: "/loans",
  });
};

/**
 * @desc    Get Profile Page
 * @route   GET "/profiles"
 * @access  Private
 */
exports.getProfile = (req, res, next) => {
  let message = null;
  const errorMessage = req.flash("error")[0];
  const successMessage = req.flash("success")[0];
  if (errorMessage) {
    message = { status: false, value: errorMessage };
  } else if (successMessage) {
    message = { status: true, value: successMessage };
  }
  res.status(200).render("home/profile", {
    layout: "layouts/main",
    pageTitle: "Profil Pengguna",
    path: "/profiles",
    message,
    value: null,
    errors: null,
  });
};

/**
 * @desc    Handling Profile Update
 * @route   PUT "/profiles"
 * @access  Private
 */
exports.putProfile = (req, res, next) => {
  const { name, grade, absen, bio } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("home/profile", {
      layout: "layouts/main",
      pageTitle: "Profil Pengguna",
      path: "/profiles",
      message: { status: false, value: "Gagal mengubah profil!" },
      value: { name, grade, absen, bio },
      errors: errors.mapped(),
    });
  }
  const secretToken = jwt.sign(
    {
      name,
      email: req.user.email,
    },
    SECRET_TOKEN,
    { expiresIn: EXPIRES_JWT }
  );
  User.findById(req.user._id)
    .then((user) => {
      user.name = name;
      user.secretToken = secretToken;
      user.profile.grade = grade;
      user.profile.absen = absen;
      user.profile.bio = bio;
      return user.save();
    })
    .then(() => {
      res.clearCookie("secretToken");
      res.cookie("secretToken", secretToken, {
        httpOnly: true,
        maxAge: parseInt(MAX_AGE_COOKIE),
        secure: NODE_ENV !== "production" ? false : true,
      });
      req.flash("success", "Berhasil mengubah profil.");
      res.redirect("/profiles");
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};
