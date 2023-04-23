const { Router } = require('express');
const { tasksController } = require('../controllers');

const tasksRouter = Router();

tasksRouter.get('/', tasksController.getTasks);

module.exports = tasksRouter;
