/* const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 20],
          msg: 'Username must be between 3 and 20 characters ',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email addres',
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Age must be a number',
        },
        min: {
          args: [0],
          msg: 'Age must be a realistic number',
        },
        max: {
          args: [122],
          msg: 'Age must be a realistic number',
        },
      },
    },
  },
  {
    tableName: 'Users',
    freezeTableName: true,
    timestamps: true,
  },
);

module.exports = User; */
