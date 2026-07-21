import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Tag, X, Pencil } from 'lucide-react';
import useProfile from '../hooks/userProfile';

const DECADES = ['80s', '90s', '2000s'];

const ICONS = {
  YouTube: Play,
  eBay: Tag,
};

function SavedItemCard({ item, onUnsave }) {
  const Icon = ICONS[item.source] || Tag;

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="relative bg-neutral h-32 flex items-center justify-center rounded-t-box overflow-hidden">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="opacity-40" size={32} />
        )}
        <span
          className={`badge badge-sm absolute top-2 right-2 ${
            item.source === 'YouTube'
              ? 'badge-error text-white'
              : 'badge-warning'
          }`}
        >
          {item.source}
        </span>
      </div>
      <div className="card-body p-3">
        <p className="font-semibold text-sm leading-snug">{item.title}</p>
        <button
          className="btn btn-outline btn-sm mt-1"
          onClick={() => onUnsave(item)}
        >
          ♥ Saved
        </button>
      </div>
    </div>
  );
}

function ProfilePage() {
  const {
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
  } = useProfile();

  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const [editingDecade, setEditingDecade] = useState(false);
  const [decadeDraft, setDecadeDraft] = useState('');

  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [newInterest, setNewInterest] = useState('');
  const [addingInterest, setAddingInterest] = useState(false);

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <p className="opacity-60">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <p className="opacity-60">Couldn't load your profile.</p>
      </div>
    );
  }

  const initials = user.email.slice(0, 2).toUpperCase();
  const memberSince = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : '—';

  const startEditingDecade = () => {
    setDecadeDraft(user.decade || '80s');
    setEditingDecade(true);
  };

  const saveDecade = async () => {
    await updateDecade(decadeDraft);
    setEditingDecade(false);
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    const ok = await changePassword(currentPassword, newPassword);
    if (ok) {
      setCurrentPassword('');
      setNewPassword('');
      setChangingPassword(false);
    }
  };

  const submitAddInterest = async (e) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    await addInterest(newInterest.trim());
    setNewInterest('');
    setAddingInterest(false);
  };

  return (
    <div data-theme="synthwave" className="min-h-screen bg-base-300">
      {/* Top nav */}
      <div className="navbar bg-base-100 border-b border-base-content/10 px-6">
        <div className="flex-1">
          <span className="text-xl font-bold">NostalgiaBoard</span>
        </div>
        <div className="flex-none gap-6 hidden sm:flex">
          <Link to="/feed" className="opacity-60 hover:opacity-100">
            Feed
          </Link>
          <span className="font-semibold">Profile</span>
          <button
            onClick={handleSignOut}
            className="opacity-60 hover:opacity-100"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        {error && (
          <div className="alert alert-error text-sm mb-4">
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success text-sm mb-4">
            <span>{success}</span>
          </div>
        )}

        {/* Profile header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-14">
                <span className="text-lg">{initials}</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">{user.email.split('@')[0]}</h1>
              <p className="text-sm opacity-60">
                Member since {memberSince} · Decade: {user.decade || 'not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Account section */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3">Account</h2>
          <div className="bg-base-100 rounded-box divide-y divide-base-content/10">
            <div className="flex justify-between items-center p-4">
              <span className="opacity-70">Email</span>
              <span>{user.email}</span>
            </div>

            <div className="flex justify-between items-center p-4">
              <span className="opacity-70">Password</span>
              {changingPassword ? (
                <form
                  onSubmit={submitPasswordChange}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="password"
                    placeholder="Current password"
                    className="input input-bordered input-sm"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="input input-bordered input-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setChangingPassword(false)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="tracking-widest">••••••••</span>
                  <button
                    className="link link-primary text-sm"
                    onClick={() => setChangingPassword(true)}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center p-4">
              <span className="opacity-70">Decade</span>
              {editingDecade ? (
                <div className="flex gap-2 items-center">
                  <select
                    className="select select-bordered select-sm"
                    value={decadeDraft}
                    onChange={(e) => setDecadeDraft(e.target.value)}
                  >
                    {DECADES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={saveDecade}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditingDecade(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>{user.decade}</span>
                  <button
                    onClick={startEditingDecade}
                    className="opacity-60 hover:opacity-100"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* My interests */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3">My interests</h2>
          <div className="flex flex-wrap gap-2 items-center">
            {user.interests.map((interest) => (
              <span key={interest.id} className="badge badge-lg gap-2 py-4">
                {interest.tag}
                <button onClick={() => removeInterest(interest.id)}>
                  <X size={14} />
                </button>
              </span>
            ))}

            {addingInterest ? (
              <form
                onSubmit={submitAddInterest}
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Pokemon"
                  className="input input-bordered input-sm"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onBlur={() => !newInterest && setAddingInterest(false)}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Add
                </button>
              </form>
            ) : (
              <button
                className="badge badge-lg badge-outline gap-1"
                onClick={() => setAddingInterest(true)}
              >
                + Add
              </button>
            )}
          </div>
        </section>

        {/* Saved items */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3">Saved items</h2>
          {savedItems.length === 0 ? (
            <p className="opacity-60 text-sm">
              Nothing saved yet — head to your{' '}
              <Link to="/feed" className="link link-primary">
                feed
              </Link>{' '}
              and heart something you like.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedItems.map((item) => (
                <SavedItemCard
                  key={`${item.source}-${item.externalId}`}
                  item={item}
                  onUnsave={unsaveItem}
                />
              ))}
            </div>
          )}
        </section>

        {/* Danger zone */}
        <section className="border-t border-base-content/10 pt-6">
          {!confirmingDelete ? (
            <button
              className="btn btn-outline btn-error btn-sm"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete account
            </button>
          ) : (
            <div className="bg-error/10 border border-error/30 rounded-box p-4">
              <p className="text-sm mb-3">
                This permanently deletes your account, interests, and saved
                items. This can't be undone.
              </p>
              <div className="flex gap-2">
                <button
                  className="btn btn-error btn-sm"
                  onClick={deleteAccount}
                >
                  Yes, delete my account
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setConfirmingDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
