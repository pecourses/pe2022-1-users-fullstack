const path = require('path');
const _ = require('lodash');
const createError = require('http-errors');
const { User } = require('./../models');

module.exports.createUser = async (req, res, next) => {
  // дістати дані з body
  const { body, file } = req;
  try {
    // спробувати створити нового користувача в БД
    if (file) {
      body.image = path.join('images', file.filename);
    }
    const createdUser = await User.create(body);
    // ок - відправити 200 + створеного користувача
    const preparedUser = _.omit(createdUser.get(), [
      'passwordHash',
      'createdAt',
      'updatedAt',
    ]);
    res.status(201).send({ data: preparedUser });
  } catch (e) {
    // не ок - відправити 4** або 5** + помилку
    next(e);
  }
};

module.exports.getUsers = async (req, res, next) => {
  const { limit = 10, offset = 0 } = req.query;

  try {
    const foundUsers = await User.findAll({
      raw: true,
      attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt'] },
      limit,
      offset,
      order: ['id'],
    });
    res.status(200).send({ data: foundUsers });
  } catch (e) {
    next(e);
  }
};

module.exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const foundUser = await User.findByPk(userId, {
      raw: true,
      attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt'] },
      // where: { id: userId },
    });
    if (!foundUser) {
      return next(createError(404, 'User Not Found'));
    }
    res.status(200).send({ data: foundUser });
  } catch (e) {
    next(e);
  }
};

module.exports.updateUserById = async (req, res, next) => {
  const {
    body,
    params: { userId },
  } = req;

  try {
    const [, [updatedUser]] = await User.update(body, {
      raw: true,
      where: { id: userId },
      returning: true,
    });

    if (!updatedUser) {
      return next(createError(404, 'User Not Found'));
    }

    const preparedUser = _.omit(updatedUser, [
      'passwordHash',
      'createdAt',
      'updatedAt',
    ]);

    res.status(200).send({ data: preparedUser });
  } catch (e) {
    next(e);
  }
};

module.exports.updateOrCreateUserById = async (req, res, next) => {
  const {
    body,
    params: { userId },
  } = req;

  try {
    const [, [updatedUser]] = await User.update(body, {
      raw: true,
      where: { id: userId },
      returning: true,
    });

    if (!updatedUser) {
      body.id = userId;
      return next();
    }

    const preparedUser = _.omit(updatedUser, [
      'passwordHash',
      'createdAt',
      'updatedAt',
    ]);

    res.status(200).send({ data: preparedUser });
  } catch (e) {
    next(e);
  }
};

module.exports.deleteUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const deletedUsersCount = await User.destroy({ where: { id: userId } });

    if (!deletedUsersCount) {
      return next(createError(404, 'User Not Found'));
    }

    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports.getUserTasks = async (req, res, next) => {
  // первірити, чи користувач існує
  // + отримати його таски
  // - 404

  const { userId } = req.params;

  try {
    const foundUser = await User.findByPk(userId);

    if (!foundUser) {
      return next(createError(404, 'User Not Found'));
    }

    const foundTasks = await foundUser.getTasks({
      raw: true,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    res.status(200).send({ data: foundTasks });
  } catch (e) {
    next(e);
  }
};

module.exports.changeUserImage = async (req, res, next) => {
  const {
    params: { userId },
    file,
  } = req;

  try {
    if (!file) {
      return next(createError(422, 'File is required'));
    }
    const [, [updatedUser]] = await User.update(
      { image: path.join('images', file.filename) },
      { where: { id: userId }, returning: true, raw: true }
    );
    if (!updatedUser) {
      return next(createError(404, 'User Not Found'));
    }
    res.status(200).send({ data: updatedUser });
  } catch (err) {
    next(err);
  }
};
