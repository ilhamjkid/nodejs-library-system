const fsPromises = require("fs/promises");

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
  // Validate Position
  check("position")
    // Check Position empty
    .not()
    .isEmpty()
    .withMessage("Posisi wajib diisi!")
    // Check valid position
    .custom((value) => {
      if (!/[0-9]/gi.test(value)) return true;
      return Promise.reject("Posisi tidak valid!");
    }),
  // Validate Teacher's Code
  check("code")
    // Check Code empty
    .not()
    .isEmpty()
    .withMessage("Kode guru wajib diisi!")
    // Check valid code
    .isNumeric()
    .withMessage("Kode guru tidak valid!"),
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

exports.checkManageBook = [
  // Validate Title
  check("title")
    // Check Title empty
    .not()
    .isEmpty()
    .withMessage("Judul wajib diisi!")
    // Check title length
    .isLength({ min: 3, max: 18 })
    .withMessage("Bio harus berisi 3 sampai 18 karakter!"),
  // Validate Image
  check("image")
    // Check File Image Empty
    .custom((value, { req }) => {
      if (!req?.file) return Promise.reject("File harus diisi!");
      else return true;
    })
    // Check File Type
    .custom((value, { req }) => {
      const imageType = req?.uploadError?.image;
      if (imageType) return Promise.reject(imageType);
      else return true;
    })
    // Check File Size
    .custom((value, { req }) => {
      if (req?.file?.size > 2000000) {
        return fsPromises
          .unlink(req.file.path)
          .then(() => Promise.reject("File terlalu besar. Maksimal 2mb!"))
          .catch((err) => {
            const error = new Error(err);
            error.statusCode = 500;
            next(error);
          });
      } else return true;
    }),
];
