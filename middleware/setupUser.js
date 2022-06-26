const User = require("../models/User");

const jwt = require("jsonwebtoken");

const { SECRET_TOKEN } = process.env;

module.exports = (req, res, next) => {
  const secretToken = req.cookies.secretToken;
  if (!secretToken) return next();
  User.findOne({ secretToken })
    .then((user) => {
      if (!user) {
        res.clearCookie("secretToken");
        return next();
      }
      jwt.verify(secretToken, SECRET_TOKEN, (err, decoded) => {
        if (err) {
          user.secretToken = null;
          return user.save().then(() => {
            res.clearCookie("secretToken");
            return next();
          });
        } else {
          req.user = user;
          return next();
        }
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};
