const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Users = require('./User');

const InterestTag = sequelize.define(
  'InterestTag',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('category', 'specific'),
      allowNull: false,
    },
  },
  {
    tableName: 'interest_tags',
    timestamps: false,
  },
);

//Associations
Users.hasMany(InterestTag, { foreignKey: 'user_id', onDelete: 'CASCADE' });
InterestTag.belongsTo(Users, { foreignKey: 'user_id' });

module.exports = InterestTag;
