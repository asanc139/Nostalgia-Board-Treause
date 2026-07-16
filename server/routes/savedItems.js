const express = require('express');
const requireAuth = require('../middleware/auth');
const SavedItem = require('../models/SavedItem');

const router = express.Router();

// GET /api/saved-items — list everything the logged-in user has saved
router.get('/saved-items', requireAuth, async (req, res) => {
  try {
    const items = await SavedItem.findAll({
      where: { user_id: req.userId },
      order: [['created_at', 'DESC']],
    });
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load saved items.' });
  }
});

//POST /api/saved-items - save a new item code below
router.post('/saved-items', requireAuth, async (req, res) => {
  const { externalId, source, title, meta, link, thumbnail, interest } =
    req.body;

  if (!externalId || !source || !title) {
    return res
      .status(400)
      .json({ error: 'externalId, source, and title are required.' });
  }

  try {
    const [item, created] = await SavedItem.findOrCreate({
      where: { user_id: req.userId, externalId, source },
      defaults: { title, meta, link, thumbnail, interest, user_id: req.userId },
    });
    res.status(created ? 201 : 200).json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save item.' });
  }
});

//DELETE /api/saved-items/:source/:externalId - unsave an item
router.delete(
  '/saved-items/:source/:externalId',
  requireAuth,
  async (req, res) => {
    const { source, externalId } = req.params;

    try {
      const deleted = await SavedItem.destroy({
        where: { user_id: req.userId, source, externalId },
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Saved item not found.' });
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to unsave item.' });
    }
  },
);

module.exports = router;
// Note: The through-line across all three: every single query is scoped to "req.userId",
//which comes from the verified JWT, not from anything the frontend could fake in a request body or URL.
//That's the real backbone of this file — data isolation between users, enforced at the database query level, not just trusted client-side.
