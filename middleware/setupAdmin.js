const User = require("../models/User");

const bcrypt = require("bcryptjs");

const admin1 = {
  name: process.env.ADMIN1_NAME || "John Doe",
  email: process.env.ADMIN1_EMAIL || "john.doe@gmail.com",
  password: process.env.ADMIN1_PASSWORD || "12345678",
  secretToken: null,
  isAdmin: true,
};
const admin2 = {
  name: process.env.ADMIN2_NAME || "Douglas Joe",
  email: process.env.ADMIN2_EMAIL || "douglas.joe@gmail.com",
  password: process.env.ADMIN2_PASSWORD || "12345678",
  secretToken: null,
  isAdmin: true,
};

module.exports = (req, res, next) => {
  User.findOne({ email: admin1.email })
    .then((user1) => {
      if (user1) return user1;
      return bcrypt.hash(admin1.password, 12).then((pwHash) => {
        return User.create({ ...admin1, password: pwHash });
      });
    })
    .then(() => User.findOne({ email: admin2.email }))
    .then((user2) => {
      if (user2) return user2;
      return bcrypt.hash(admin2.password, 12).then((pwHash) => {
        return User.create({ ...admin2, password: pwHash });
      });
    })
    .then(() => next())
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 500;
      next(error);
    });
};
