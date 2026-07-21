const express = require('express');
const requireAuth = require('../middleware/auth');
const User = require('../models/User');
const InterestTag = require('../models/InterestTag');
const SavedItem = require('../models/SavedItem');
const { searchYouTube } = require('../utils/youtube');
const { searchEbay } = require('../utils/ebay');

const router = express.Router();

// Cap how many search terms we fan out to, to keep API usuage/latency reasonable
const MAX_TERMS = 8; // The MLB scout only has time to check 8 teams today, keeps things simple
const RESULTS_PER_SOURCE = 3;

//decidng which teams to scout, if a fan gave specific favorites like 98' Bulls, scout goes directly there.
function buildSearchTerms({ decade, categories, interests }) {
  if (interests.length > 0) return interests.slice(0, MAX_TERMS);
  if (categories.length > 0) {
    return categories
      .slice(0, MAX_TERMS)
      .map((cat) => (decade ? `${decade} ${cat}` : cat));
  }
  return [decade ? `${decade} nostalgia` : 'nostalgia collectibles'];
}
// Think of feed.js as a MLB scout coordinating game footage and merchandise for a fan
router.get('/feed', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId); //findByPk in sequelize method obtains only a single entry from the table, using the provided primary key.

    if (!user) {
      return res.status(404).json({ error: 'User not found here!' });
    }
    const tags = await InterestTag.findAll({ where: { user_id: user.id } });
    const categories = tags
      .filter((t) => t.type === 'category')
      .map((t) => t.tag);
    const interests = tags
      .filter((t) => t.type === 'specific')
      .map((t) => t.tag);

    const searchTerms = buildSearchTerms({
      decade: user.decade,
      categories,
      interests,
    });

    // Fan out YouTube + eBay searches for every term, in parallel
    const searchPromises = searchTerms.map(async (term) => {
      const [youtubeResults, ebayResults] = await Promise.all([
        searchYouTube(term, RESULTS_PER_SOURCE),
        searchEbay(term, RESULTS_PER_SOURCE),
      ]); // THIS PART IS IMPORTANT!
      //Its like the scout sending 2 assistance at once to collect game footage(YT) and merchandise(Ebay)- instead of doing it all at once

      return [...youtubeResults, ...ebayResults].map((item) => ({
        ...item, // spread operator meaning everything in item copy it over
        interest: term,
      }));
    });

    const resultsByTerm = await Promise.all(searchPromises);
    const allItems = resultsByTerm.flat(); // The flat method is like throwing all the baseballs you have into 1 bucket only instead of multiple

    // Mark which items the user has already saved, so the UI can show "Saved" state
    const saved = await SavedItem.findAll({ where: { user_id: user.id } });
    const savedKeys = new Set(saved.map((s) => `${s.source}:${s.externalId}`));

    const itemsWithSavedFlag = allItems.map((item) => ({
      ...item, // spread operator meaning everything in item copy it over
      saved: savedKeys.has(`${item.source}:${item.externalId}`),
    }));

    res.json({ items: itemsWithSavedFlag, searchTerms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load feed.' });
  }
});

module.exports = router;
// All in one basically all of this means that the MLB Scouts the users favorite interests across Youtue and eBay in parralel,
// combines the results into one list, and flags wich ones the user has already saved
