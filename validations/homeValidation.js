const { check } = require("express-validator");

exports.checkUpdateProfile = [
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
  // Validate Grade
  check("grade")
    // Check grade empty
    .not()
    .isEmpty()
    .withMessage("Kelas wajib diisi!"),
  // Validate Absen
  check("absen")
    // Check Absen empty
    .not()
    .isEmpty()
    .withMessage("No. Absen wajib diisi!")
    // Check valid absen
    .isNumeric()
    .withMessage("No. Absen tidak valid!"),
  // Validate Bio
  check("bio")
    // Check Bio empty
    .not()
    .isEmpty()
    .withMessage("Bio wajib diisi!")
    // Check bio length
    .isLength({ min: 5, max: 200 })
    .withMessage("Bio harus berisi 5 sampai 200 karakter!"),
];
