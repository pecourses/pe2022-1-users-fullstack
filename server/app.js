const express = require('express');
const router = require('./routes');
const { errorHandlers } = require('./middleware');
const { STATIC_PATH } = require('./constants');

const app = express();

app.use(express.static(STATIC_PATH));

app.use(express.json());

app.use('/api', router);

app.use(errorHandlers.dbErrorHandler, errorHandlers.errorHandler);

module.exports = app;

// MultipartFormData;
// file;
// body;

// GET /api/users
// POST /api/users
// GET /api/users/1
// PATCH /api/users/1
// DELETE /api/users/1

// users 1 : n tasks
// GET /api/users/1/tasks

// POST /api/tasks
// GET /api/tasks

// http://localhost:5000/image1.jpeg
