const express = require('express');
const bcrypt = require('bcrypt');
const requireAuth = require('../middleware/auth');
const User = require('../models/Users');
const InterestTag = require('../models/InterestTag');

const router = express.Router();
const VALID_DECADES = ['80s', '90s', '2000s'];

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const tags = await InterestTag.findAll({ where: { user_id: user.id } }); // Fetches all their interest tags rows separately by cat & interests

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

// PATCH /api/me — update decade (extend here later for other basic fields)
router.patch('/me', requireAuth, async (req, res) => {
  const { decade } = req.body;

  if (decade && !VALID_DECADES.includes(decade)) {
    return res
      .status(400)
      .json({ error: 'Decade must be one of: 80s, 90s, 2000s.' });
  }

  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (decade) user.decade = decade;
    await user.save();

    res.json({ id: user.id, email: user.email, decade: user.decade });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});
// PATCH /api/me/password — change password, requires current password
router.patch('/me/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: 'Current and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: 'New password must be at least 6 characters.' });
  }

  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!matches) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update password.' });
  }
});
// DELETE /api/me — permanently delete account and all associated data
router.delete('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // InterestTag and SavedItem both have onDelete: 'CASCADE' on their
    // association with User, so deleting the user cleans up everything else.
    await user.destroy();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
});

module.exports = router; //This file basically says to the server who am i? and what do i like and what of my interest can i delete?
