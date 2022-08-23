const multer = require("multer");
const path = require("path");
// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1024 * 1024 * 10,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg"
      )
        cb(null, true);
      else {
        cb(null, false);
      }
    }
  },
});