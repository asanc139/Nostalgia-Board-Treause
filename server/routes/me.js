const express = require('express');
const requireAuth = require('../middleware/auth');
const User = require('../models/User');
const InterestTag = require('../models/InterestTag');

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const tags = await InterestTag.findAll({ where: { user_id: user.id } });

    const categories = tags
      .filter((t) => t.type === 'category')
      .map((t) => t.tag);
    const interests = tags
      .filter((t) => t.type === 'specific')
      .map((t) => t.tag);

    res.json({
      id: user.id,
      email: user.email,
      decade: user.decade,
      categories,
      interests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load user profile.' });
  }
});

module.exports = router;
//This file basically says to the server who am i? and what do i like and what of my interest can i delete?
