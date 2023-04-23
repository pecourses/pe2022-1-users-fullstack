'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate (models) {
      Task.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }

  Task.init(
    {
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deadline: {
        type: DataTypes.DATEONLY,
        validate: {
          isDate: true,
          isAfter: new Date().toISOString(),
        },
      },
    },
    {
      sequelize,
      modelName: 'Task',
      underscored: true,
    }
  );
  return Task;
};
