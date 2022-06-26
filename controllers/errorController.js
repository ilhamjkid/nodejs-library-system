/**
 * @desc    Get 404 Page
 * @route   All Route
 * @access  Public && Private
 */
exports.get404 = (req, res, next) => {
  res.status(404).render("errors/error", {
    user: null,
    isAuthenticated: false,
    layout: "layouts/main",
    pageTitle: "Kesalahan",
    path: "*",
    statusCode: 404,
    errorMessage: "Halaman Tidak Ditemukan",
  });
};

/**
 * @desc    Get Error Page
 * @route   All Route
 * @access  Public && Private
 */
exports.get500 = (error, req, res, next) => {
  let statusCode, errorMessage;
  statusCode = error.statusCode || 500;
  if (process.env.NODE_ENV === "production") {
    errorMessage = "Kesalahan Sistem Kami";
  } else errorMessage = error.message;
  res.status(statusCode).render("errors/error", {
    user: null,
    isAuthenticated: false,
    layout: "layouts/main",
    pageTitle: "Kesalahan",
    path: "*",
    statusCode,
    errorMessage,
  });
};
