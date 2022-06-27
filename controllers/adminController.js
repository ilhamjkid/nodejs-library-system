const User = require("../models/User");
const Book = require("../models/Book");
const Order = require("../models/Order");
const Borrower = require("../models/Borrower");

const path = require("path");
const fs = require("fs/promises");

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const rootDir = require("../helpers/rootDir");

const { NODE_ENV, SECRET_TOKEN, EXPIRES_JWT, MAX_AGE_COOKIE } = process.env;

/**
 * @desc    Get Borrower Page
 * @route   GET "/admin/borrowers"
 * @access  Private
 */
exports.getBorrower = (req, res, next) => {
  let message = null;
  const errorMessage = req.flash("error")[0];
  const successMessage = req.flash("success")[0];
  if (errorMessage) {
    message = { status: false, value: errorMessage };
  } else if (successMessage) {
    message = { status: true, value: successMessage };
  }
  const activePage = +req?.query?.page || 1;
  const itemsPerPage = 8;
  let totalItems;
  Borrower.countDocuments()
    .then((numBorrowers) => {
      totalItems = numBorrowers;
      return Borrower.find()
        .skip((activePage - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .populate("userId bookId");
    })
    .then((borrowers) => {
      res.status(200).render("admin/borrower", {
        layout: "layouts/main",
        pageTitle: "Daftar Peminjam",
        path: "/admin/borrowers",
        message,
        borrowers,
        totalItems,
        itemsPerPage,
        pagination: {
          currentPage: activePage,
          hasNextPage: itemsPerPage * activePage < totalItems,
          hasPreviousPage: activePage > 1,
          nextPage: activePage + 1,
          previousPage: activePage - 1,
          lastPage: Math.ceil(totalItems / itemsPerPage),
        },
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

/**
 * @desc    Handling Borrower Confirm
 * @route   DELETE "/admin/borrowers"
 * @access  Private
 */
exports.confirmBorrower = (req, res, next) => {
  Borrower.findById(req?.body?.borrowerId)
    .then((borrower) => {
      if (!borrower) throw "Peminjam tidak ditemukan.";
      return borrower.remove().then(() => {
        req.flash("success", "Berhasil mengkonfirmasi peminjam buku.");
        return res.redirect("/admin/borrowers");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

/**
 * @desc    Get Order Page
 * @route   GET "/admin/orders"
 * @access  Private
 */
exports.getOrders = (req, res, next) => {
  let message = null;
  const errorMessage = req.flash("error")[0];
  const successMessage = req.flash("success")[0];
  if (errorMessage) {
    message = { status: false, value: errorMessage };
  } else if (successMessage) {
    message = { status: true, value: successMessage };
  }
  Order.find()
    .populate("userId bookId")
    .then((orders) => {
      res.status(200).render("admin/order", {
        layout: "layouts/main",
        pageTitle: "Order Buku",
        path: "/admin/orders",
        message,
        orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

/**
 * @desc    Handling Order Resolve
 * @route   POST "/admin/orders"
 * @access  Private
 */
exports.postOrder = (req, res, next) => {
  let orderDeleted;
  Order.findById(req?.body?.orderId)
    .populate("userId bookId")
    .then((order) => {
      orderDeleted = order;
      if (!order) throw "Orderan tidak ditemukan.";
      return orderDeleted.remove().then(() => {
        return Borrower.create({
          userId: order?.userId,
          bookId: order?.bookId,
        }).then(() => {
          req.flash("success", "Berhasil menerima orderan.");
          return res.redirect("/admin/orders");
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
 * @desc    Handling Order Reject
 * @route   DELETE "/admin/orders"
 * @access  Private
 */
exports.deleteOrder = (req, res, next) => {
  Order.findById(req?.body?.orderId)
    .then((order) => {
      if (!order) throw "Orderan tidak ditemukan.";
      return order.remove().then(() => {
        req.flash("success", "Berhasil menolak orderan.");
        return res.redirect("/admin/orders");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

/**
 * @desc    Get Book List Page
 * @route   GET "/admin/books"
 * @access  Private
 */
exports.getBookList = (req, res, next) => {
  let message = null;
  const errorMessage = req.flash("error")[0];
  const successMessage = req.flash("success")[0];
  if (errorMessage) {
    message = { status: false, value: errorMessage };
  } else if (successMessage) {
    message = { status: true, value: successMessage };
  }
  const activePage = +req?.query?.page || 1;
  const itemsPerPage = 8;
  let totalItems;
  Book.countDocuments()
    .then((numBooks) => {
      totalItems = numBooks;
      return Book.find()
        .skip((activePage - 1) * itemsPerPage)
        .limit(itemsPerPage);
    })
    .then((books) => {
      res.status(200).render("admin/book-list", {
        layout: "layouts/main",
        pageTitle: "Daftar Buku",
        path: "/admin/books",
        message,
        books,
        totalItems,
        itemsPerPage,
        pagination: {
          currentPage: activePage,
          hasNextPage: itemsPerPage * activePage < totalItems,
          hasPreviousPage: activePage > 1,
          nextPage: activePage + 1,
          previousPage: activePage - 1,
          lastPage: Math.ceil(totalItems / itemsPerPage),
        },
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

/**
 * @desc    Get Book Add Page
 * @route   GET "/admin/books/create"
 * @access  Private
 */
exports.getBookAdd = (req, res, next) => {
  let message = null;
  const errorMessage = req.flash("error")[0];
  const successMessage = req.flash("success")[0];
  if (errorMessage) {
    message = { status: false, value: errorMessage };
  } else if (successMessage) {
    message = { status: true, value: successMessage };
  }
  res.status(200).render("admin/book-manage", {
    layout: "layouts/main",
    pageTitle: "Tambah Buku",
    path: "/admin/books/create",
    editing: false,
    message,
    value: null,
    errors: null,
  });
};

/**
 * @desc    Handling Book Create
 * @route   POST "/admin/books/create"
 * @access  Private
 */
exports.postBookAdd = (req, res, next) => {
  const fileImage = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (fileImage) {
      const filePath = path.join(rootDir, "uploads", "images", fileImage.filename);
      return fs.unlink(filePath).then(() => {
        return res.status(422).render("admin/book-manage", {
          layout: "layouts/main",
          pageTitle: "Tambah Buku",
          path: "/admin/books/create",
          editing: false,
          message: { status: false, value: "Gagal menambahkan buku." },
          value: { title: req?.body?.title },
          errors: errors.mapped(),
        });
      });
    }
    return res.status(422).render("admin/book-manage", {
      layout: "layouts/main",
      pageTitle: "Tambah Buku",
      path: "/admin/books/create",
      editing: false,
      message: { status: false, value: "Gagal menambahkan buku." },
      value: { title: req?.body?.title },
      errors: errors.mapped(),
    });
  }
  Book.create({
    title: req.body.title,
    image: `images/${fileImage.filename}`,
  })
    .then(() => {
      req.flash("success", "Berhasil menambahkan buku.");
      res.redirect("/admin/books");
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

/**
 * @desc    Get Book Edit Page
 * @route   GET "/admin/books/edit/:bookId"
 * @access  Private
 */
exports.getBookEdit = (req, res, next) => {
  let message = null;
  const errorMessage = req.flash("error")[0];
  const successMessage = req.flash("success")[0];
  if (errorMessage) {
    message = { status: false, value: errorMessage };
  } else if (successMessage) {
    message = { status: true, value: successMessage };
  }
  Book.findById(req?.params?.bookId)
    .then((book) => {
      if (!book) throw "Buku tidak ditemukan.";
      res.status(200).render("admin/book-manage", {
        layout: "layouts/main",
        pageTitle: "Ubah Buku " + book.title,
        path: "/admin/books",
        editing: true,
        message,
        value: book,
        errors: null,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

/**
 * @desc    Handling Book Update
 * @route   PUT "/admin/books/edit/:bookId?_method=put"
 * @access  Private
 */
exports.putBookEdit = (req, res, next) => {
  const fileImage = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (fileImage) {
      const filePath = path.join(rootDir, "uploads", "images", fileImage.filename);
      return fs.unlink(filePath).then(() => {
        return res.status(422).render("admin/book-manage", {
          layout: "layouts/main",
          pageTitle: "Ubah Buku " + req?.body?.title,
          path: "/admin/books",
          editing: true,
          message: { status: false, value: "Gagal mengubah buku." },
          value: { _id: req?.params?.bookId, title: req?.body?.title },
          errors: errors.mapped(),
        });
      });
    }
    return res.status(422).render("admin/book-manage", {
      layout: "layouts/main",
      pageTitle: "Ubah Buku " + req?.body?.title,
      path: "/admin/books",
      editing: true,
      message: { status: false, value: "Gagal mengubah buku." },
      value: { _id: req?.params?.bookId, title: req?.body?.title },
      errors: errors.mapped(),
    });
  }
  Book.findById(req?.params?.bookId)
    .then((book) => {
      if (!book) throw "Buku tidak ditemukan.";
      return fs
        .unlink(path.join(rootDir, "uploads", book.image))
        .then(() => {
          book.title = req?.body?.title;
          book.image = `images/${fileImage.filename}`;
          return book.save();
        })
        .then(() => {
          req.flash("success", "Berhasil mengubah buku.");
          res.redirect("/admin/books");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};

/**
 * @desc    Handling Book Delete
 * @route   DELETE "/admin/books/delete"
 * @access  Private
 */
exports.deleteBook = (req, res, next) => {
  Book.findById(req?.body?.bookId)
    .then((book) => {
      if (!book) throw "Buku tidak ditemukan.";
      fs.unlink(path.join(rootDir, "uploads", book.image))
        .then(() => book.remove())
        .then(() => {
          req.flash("success", "Berhasil menghapus buku.");
          res.redirect("/admin/books");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
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
      message: { status: false, value: "Gagal mengubah profil." },
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
