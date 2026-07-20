const express = require('express');
const requireAuth = require('../middleware/auth');
const InterestTag = require('../models/InterestTag');

const router = express.Router();

// POST /api/interests — add a new interest (defaults to type 'specific')
router.post('/interests', requireAuth, async (req, res) => {
  const { tag, type = 'specific' } = req.body;
  if (!tag || !tag.trim()) {
    return res.status(400).json({ error: 'Tag is required.' });
  }
  if (!['category', 'specific'].includes(type)) {
    return res
      .status(400)
      .json({ error: "Type must be 'category' or 'specific'." });
  }
  try {
    const [interestTag] = await InterestTag.findOrCreate({
      where: { user_id: req.userId, tag: tag.trim(), type },
      defaults: { user_id: req.userId, tag: tag.trim(), type },
    });

    res
      .status(201)
      .json({
        id: interestTag.id,
        tag: interestTag.tag,
        type: interestTag.type,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add interest.' });
  }
});

// DELETE /api/interests/:id — remove an interest, scoped to the logged-in user
router.delete('/interests/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await InterestTag.destroy({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Interest not found.' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove interest.' });
  }
});

module.exports = router;
