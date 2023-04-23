const multer = require('multer');
const path = require('path');
const { STATIC_PATH } = require('../constants');
const createError = require('http-errors');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(STATIC_PATH, 'images'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

function fileFilter (req, file, cb) {
  const MIMETYPE_REGEXP = /^image\/(gif|jpeg|png)$/;
  // cb(null, MIMETYPE_REGEXP.test(file.mimetype));

  // Якщо тип файлу допустимий, то зберігаємо
  if (MIMETYPE_REGEXP.test(file.mimetype)) {
    return cb(null, true);
  }
  // Інакше генеруємо помилку і перериваємо ланцюжок обробників
  cb(createError(415, 'Support only jpeg/png/gif mimetypes'));
}

const upload = multer({ storage, fileFilter });

module.exports.uploadUserPhoto = upload.single('userPhoto');
