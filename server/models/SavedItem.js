const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./Users');

const SavedItem = sequelize.define(
  'SavedItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    externalId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'external_id',
    },
    source: {
      type: DataTypes.ENUM('YouTube', 'eBay'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    interest: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'saved_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);
// Associations
User.hasMany(SavedItem, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SavedItem.belongsTo(User, { foreignKey: 'user_id' });

module.exports = SavedItem;
