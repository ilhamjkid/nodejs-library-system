const User = require("../models/User");

const { check } = require("express-validator");

exports.checkRegister = [
  // Validate Name
  check("name")
    // Check Name empty
    .not()
    .isEmpty()
    .withMessage("Nama wajib diisi!")
    // Check valid name
    .custom((value) => {
      if (!/[0-9]/gi.test(value)) return true;
      return Promise.reject("Nama tidak valid!");
    })
    // Check name length
    .isLength({ min: 3, max: 20 })
    .withMessage("Nama harus berisi 3 sampai 20 karakter!"),
  // Validate Email
  check("email")
    // Check Email empty
    .not()
    .isEmpty()
    .withMessage("Email wajib diisi!")
    // Check is Email
    .isEmail()
    .withMessage("Email tidak valid!")
    // Check if Email Exists
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) return Promise.reject("Email tidak tersedia!");
        else return true;
      });
    }),
  // Validate Password
  check("password")
    // Check Password empty
    .not()
    .isEmpty()
    .withMessage("Password wajib diisi!")
    // Check Password length
    .isLength({ min: 8 })
    .withMessage("Password harus berisi setidaknya 8 karakter!")
    // Trim Password
    .trim(),
  // Validate Confirmation
  check("confirm")
    // Check Confirmation match
    .custom((value, { req }) => {
      if (value === req.body.password) return true;
      else return Promise.reject("Konfirmasi password salah!");
    }),
];

exports.checkLogin = [
  // Validate Email
  check("email")
    // Check Email empty
    .not()
    .isEmpty()
    .withMessage("Email wajib diisi!")
    // Check is Email
    .isEmail()
    .withMessage("Email tidak valid!")
    // Check if Email Exists
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (!user) return Promise.reject("Email tidak ditemukan!");
        else return true;
      });
    }),
  // Validate Password
  check("password")
    // Check Password empty
    .not()
    .isEmpty()
    .withMessage("Password wajib diisi!"),
];
