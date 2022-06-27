const path = require("path");

const multer = require("multer");

const rootDir = require("../helpers/rootDir");

path.filename = (fileOriginal, fileName = "") => {
  const fileArray = fileOriginal.toLowerCase().split(".");
  const fileLength = fileArray.length - 1;
  fileArray.forEach((name, index) => {
    if (fileLength > index) fileName += name;
  });
  return fileName.slice(0, 10);
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(rootDir, "uploads", "images"));
  },
  filename: (req, file, cb) => {
    const timeNow = Date.now();
    const randomInt = Math.round(Math.random() * 10000);
    const fileName = path.filename(file.originalname);
    const extName = path.extname(file.originalname);
    cb(null, `${fileName}${timeNow}${randomInt}${extName}`);
  },
});

exports.uploadImage = multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== "image/jpeg" && // JPG
      file.mimetype !== "image/png" && // PNG
      file.mimetype !== "image/svg+xml" && // SVG
      file.mimetype !== "image/gif" // GIF
    ) {
      req.uploadError = { image: "Format file salah!" };
      cb(null, false);
    } else cb(null, true);
  },
});
