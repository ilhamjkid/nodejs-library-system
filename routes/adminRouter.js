const express = require("express");

const adminController = require("../controllers/adminController");

const { isAuth, isAdmin } = require("../middleware/protect");

const { checkUpdateProfile } = require("../validations/adminValidation");

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

router
  .route("/profiles")
  // "GET => /admin/profiles"
  .get(isAuth, isAdmin, adminController.getProfile)
  // "PUT => /admin/profiles"
  .put(isAuth, isAdmin, checkUpdateProfile, adminController.putProfile);

module.exports = router;
