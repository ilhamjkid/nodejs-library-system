const express = require("express");

const adminController = require("../controllers/adminController");

const { isAuth, isAdmin } = require("../middleware/protect");

const router = express.Router();

// "GET => /admin/borrowers"
router.get("/borrowers", isAuth, isAdmin, adminController.getBorrower);
// "GET => /admin/orders"
router.get("/orders", isAuth, isAdmin, adminController.getOrders);
// "GET => /admin/books"
router.get("/books", isAuth, isAdmin, adminController.getBookList);
// "GET => /admin/books/create"
router.get("/books/create", isAuth, isAdmin, adminController.getBookAdd);
// "GET => /admin/books/edit/:bookId"
router.get("/books/edit/:bookId", isAuth, isAdmin, adminController.getBookEdit);
// "GET => /admin/profiles"
router.get("/profiles", isAuth, isAdmin, adminController.getProfile);

module.exports = router;
