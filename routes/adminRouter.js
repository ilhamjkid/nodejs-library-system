const express = require("express");

const adminController = require("../controllers/adminController");

const { isAuth, isAdmin } = require("../middleware/protect");

const { checkUpdateProfile, checkManageBook } = require("../validations/adminValidation");

const router = express.Router();

// "GET => /admin/borrowers"
router.get("/borrowers", isAuth, isAdmin, adminController.getBorrower);
// "GET => /admin/orders"
router.get("/orders", isAuth, isAdmin, adminController.getOrders);
// "GET => /admin/books"
router.get("/books", isAuth, isAdmin, adminController.getBookList);

router
  .route("/books/create")
  // "GET => /admin/books/create"
  .get(isAuth, isAdmin, adminController.getBookAdd)
  // "GET => /admin/books/create"
  .post(isAuth, isAdmin, checkManageBook, adminController.postBookAdd);

router
  .route("/books/edit/:bookId")
  // "GET => /admin/books/edit/:bookId"
  .get(isAuth, isAdmin, adminController.getBookEdit)
  // "PUT => /admin/books/edit/:bookId?_method=put"
  .put(isAuth, isAdmin, checkManageBook, adminController.putBookEdit);

router
  .route("/books/delete")
  // "DELETE => /admin/books/delete
  .delete(isAuth, isAdmin, adminController.deleteBook);

router
  .route("/profiles")
  // "GET => /admin/profiles"
  .get(isAuth, isAdmin, adminController.getProfile)
  // "PUT => /admin/profiles"
  .put(isAuth, isAdmin, checkUpdateProfile, adminController.putProfile);

module.exports = router;
