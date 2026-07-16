const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Users = sequelize.define(
  'Users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: 'Musr be a valid email address ' } },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    decade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

module.exports = Users;
