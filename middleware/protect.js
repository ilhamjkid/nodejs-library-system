// Check if user authenticated
exports.isAuth = (req, res, next) => {
  if (req.user) next();
  else res.redirect("/auth/register");
};

// Check if user not authenticated
exports.isGuest = (req, res, next) => {
  if (!req.user) return next();
  if (!req.user?.isAdmin) res.redirect("/");
  else res.redirect("/admin/borrowers");
};

// Check if user admin
exports.isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) next();
  else res.redirect("/");
};

// Check if user not admin
exports.isNotAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) next();
  else res.redirect("/admin/borrowers");
};
