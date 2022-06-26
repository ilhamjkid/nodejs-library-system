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
  res.status(200).render("admin/profile", {
    layout: "layouts/main",
    pageTitle: "Profil Admin",
    path: "/admin/profiles",
  });
};
