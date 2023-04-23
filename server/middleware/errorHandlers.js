const createError = require('http-errors');
const multer = require('multer');
const {
  Sequelize: { BaseError, ValidationError: SequelizeValidationError },
} = require('./../models');

module.exports.multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return next(createError(500, 'Multer Error'));
  }
  next(err);
};

module.exports.dbErrorHandler = (err, req, res, next) => {
  // Відловлюємо помилки Sequelize (https://sequelize.org/api/v6/identifiers.html#errors)

  // Помилки валідації (невалідне ім'я, неунікальне мило тощо)
  if (err instanceof SequelizeValidationError) {
    // згідно з json:api запаковуємо одразу корисну інфу з об'єкту помилки
    // одразу в масив об'єктів з полями status, message
    const errors = err.errors.map(e => ({ status: 422, title: e.message }));

    return res.status(422).send({ errors });
  }

  // Інші помилки Sequelize
  if (err instanceof BaseError) {
    next(createError(500, 'Database Error'));
  }

  next(err);
};

module.exports.errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return;
  }
  const status = err.status ?? 500;
  console.log('err :>> ', err);
  res.status(status).send({
    errors: [
      {
        status,
        title: err.message ?? 'Server Error',
      },
    ],
  });
};
