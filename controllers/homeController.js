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
  res.status(200).render("home/profile", {
    layout: "layouts/main",
    pageTitle: "Profil Pengguna",
    path: "/profiles",
  });
};
