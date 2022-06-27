const User = require("../models/User");

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const { NODE_ENV, SECRET_TOKEN, EXPIRES_JWT, MAX_AGE_COOKIE } = process.env;

/**
 * @desc    Get Borrower Page
 * @route   GET "/admin/borrowers"
 * @access  Private
 */
exports.getBorrower = (req, res, next) => {
  res.status(200).render("admin/borrower", {
    layout: "layouts/main",
    pageTitle: "Daftar Peminjam",
    path: "/admin/borrowers",
  });
};

/**
 * @desc    Get Order Page
 * @route   GET "/admin/orders"
 * @access  Private
 */
exports.getOrders = (req, res, next) => {
  res.status(200).render("admin/order", {
    layout: "layouts/main",
    pageTitle: "Order Buku",
    path: "/admin/orders",
  });
};

/**
 * @desc    Get Book List Page
 * @route   GET "/admin/books"
 * @access  Private
 */
exports.getBookList = (req, res, next) => {
  res.status(200).render("admin/book-list", {
    layout: "layouts/main",
    pageTitle: "Daftar Buku",
    path: "/admin/books",
  });
};

/**
 * @desc    Get Book Add Page
 * @route   GET "/admin/books/create"
 * @access  Private
 */
exports.getBookAdd = (req, res, next) => {
  res.status(200).render("admin/book-manage", {
    layout: "layouts/main",
    pageTitle: "Tambah Buku",
    path: "/admin/books/create",
  });
};

/**
 * @desc    Get Book Edit Page
 * @route   GET "/admin/books/edit/:bookId"
 * @access  Private
 */
exports.getBookEdit = (req, res, next) => {
  res.status(200).render("admin/book-manage", {
    layout: "layouts/main",
    pageTitle: "Ubah Buku " + req.params.bookId,
    path: "/admin/books",
  });
};

/**
 * @desc    Get Profile Page
 * @route   GET "/admin/profiles"
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
  res.status(200).render("admin/profile", {
    layout: "layouts/main",
    pageTitle: "Profil Admin",
    path: "/admin/profiles",
    message,
    value: null,
    errors: null,
  });
};

/**
 * @desc    Handling Profile Update
 * @route   PUT "/admin/profiles"
 * @access  Private
 */
exports.putProfile = (req, res, next) => {
  const { name, position, code, bio } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/profile", {
      layout: "layouts/main",
      pageTitle: "Profil Admin",
      path: "/admin/profiles",
      message: { status: false, value: "Gagal mengubah profil!" },
      value: { name, position, code, bio },
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
      user.profile.position = position;
      user.profile.code = code;
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
      res.redirect("/admin/profiles");
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};
