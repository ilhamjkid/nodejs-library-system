// Insert res.locals
module.exports = (req, res, next) => {
  res.locals.isAuthenticated = req.user && true;
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.user;
  next();
};
