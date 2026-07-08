const express = require('express');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/db');
const Users = require('../models/Users');
const InterestTag = require('../models/InterestTag');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, decade, categories = [], interests = [] } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required. ' });
  }

  const t = await sequelize.transaction();

  try {
    const hash = await bcrypt.hash(password, 10);

    const user = await Users.create(
      { email, passwordHash: hash, decade },
      { transaction: t },
    );

    const tagRecords = [
      ...categories.map((tag) => ({ user_id: user.id, tag, type: 'category' })),
      ...interests.map((tag) => ({ user_id: user.id, tag, type: 'specific' })),
    ];

    if (tagRecords.length > 0) {
      await InterestTag.bulkCreate(tagRecords, { transaction: t });
    }
    await t.commit();
    res.status(201).json({ success: true, userId: user.id });
  } catch (err) {
    await t.rollback();
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(409)
        .json({ error: 'An account with that email already exists.' });
    }
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    console.error(err);
    res.status(500).json({ error: 'Signup failed.' });
  }
});

module.exports = router;
