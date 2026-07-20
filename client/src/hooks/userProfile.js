import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function useProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [meData, savedData] = await Promise.all([
        apiFetch('/api/me'),
        apiFetch('/api/saved-items'),
      ]);
      setUser(meData);
      setSavedItems(savedData.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const updateDecade = async (decade) => {
    setError('');
    try {
      await apiFetch('/api/me', {
        method: 'PATCH',
        body: JSON.stringify({ decade }),
      });
      setUser((prev) => ({ ...prev, decade }));
      flashSuccess('Decade updated.');
    } catch (err) {
      setError(err.message);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setError('');
    try {
      await apiFetch('/api/me/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      flashSuccess('Password updated.');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const addInterest = async (tag) => {
    setError('');
    try {
      const newTag = await apiFetch('/api/interests', {
        method: 'POST',
        body: JSON.stringify({ tag, type: 'specific' }),
      });
      setUser((prev) => ({
        ...prev,
        interests: [...prev.interests, newTag],
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const removeInterest = async (id) => {
    setError('');
    // optimistic update
    const prevInterests = user.interests;
    setUser((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i.id !== id),
    }));
    try {
      await apiFetch(`/api/interests/${id}`, { method: 'DELETE' });
    } catch (err) {
      setUser((prev) => ({ ...prev, interests: prevInterests }));
      setError(err.message);
    }
  };

  const unsaveItem = async (item) => {
    setError('');
    const prevSaved = savedItems;
    setSavedItems((prev) =>
      prev.filter(
        (i) => !(i.source === item.source && i.externalId === item.externalId),
      ),
    );
    try {
      await apiFetch(`/api/saved-items/${item.source}/${item.externalId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      setSavedItems(prevSaved);
      setError(err.message);
    }
  };

  const deleteAccount = async () => {
    setError('');
    try {
      await apiFetch('/api/me', { method: 'DELETE' });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    user,
    savedItems,
    loading,
    error,
    success,
    updateDecade,
    changePassword,
    addInterest,
    removeInterest,
    unsaveItem,
    deleteAccount,
  };
}
