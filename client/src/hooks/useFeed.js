import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';

export default function useFeed() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [meData, feedData] = await Promise.all([
        apiFetch('/api/me'),
        apiFetch('/api/feed'),
      ]);
      setUser(meData);
      setItems(feedData.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSave = async (item) => {
    // optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.externalId === item.externalId && i.source === item.source
          ? { ...i, saved: !i.saved }
          : i,
      ),
    );

    try {
      if (item.saved) {
        await apiFetch(`/api/saved-items/${item.source}/${item.externalId}`, {
          method: 'DELETE',
        });
      } else {
        await apiFetch('/api/saved-items', {
          method: 'POST',
          body: JSON.stringify({
            externalId: item.externalId,
            source: item.source,
            title: item.title,
            meta: item.meta,
            link: item.link,
            thumbnail: item.thumbnail,
            interest: item.interest,
          }),
        });
      }
    } catch (err) {
      // revert on failure
      setItems((prev) =>
        prev.map((i) =>
          i.externalId === item.externalId && i.source === item.source
            ? { ...i, saved: item.saved }
            : i,
        ),
      );
      setError(err.message);
    }
  };

  // Adds a new interest, then reloads the whole feed so results for the
  // new interest actually show up (not just the sidebar list).
  const addInterest = async (tag) => {
    if (!tag || !tag.trim()) return;
    setError('');
    try {
      await apiFetch('/api/interests', {
        method: 'POST',
        body: JSON.stringify({ tag: tag.trim(), type: 'specific' }),
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return { user, items, loading, error, toggleSave, addInterest, reload: load };
}
