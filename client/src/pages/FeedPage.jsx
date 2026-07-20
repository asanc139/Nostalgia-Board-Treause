import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Tag, Grip, User } from 'lucide-react';
import useFeed from '../hooks/useFeed';

const ICONS = {
  YouTube: Play,
  eBay: Tag,
};

function ItemCard({ item, onToggleSave }) {
  const Icon = ICONS[item.source] || Tag;

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="relative bg-neutral h-36 flex items-center justify-center rounded-t-box overflow-hidden">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="opacity-40" size={40} />
        )}
        <span
          className={`badge absolute top-2 right-2 ${
            item.source === 'YouTube'
              ? 'badge-error text-white'
              : 'badge-warning'
          }`}
        >
          {item.source}
        </span>
      </div>
      <div className="card-body p-4">
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="font-semibold leading-snug hover:underline"
        >
          {item.title}
        </a>
        <p className="text-sm opacity-60">{item.meta}</p>
        <button
          className={`btn btn-outline btn-sm mt-2 ${item.saved ? 'btn-active' : ''}`}
          onClick={() => onToggleSave(item)}
        >
          {item.saved ? '♥ Saved' : '♡ Save'}
        </button>
      </div>
    </div>
  );
}

function FeedPage() {
  console.log('ENV CHECK:', import.meta.env.VITE_API_URL);
  const { user, items, loading, error, toggleSave, addInterest } = useFeed();
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const [activeInterest, setActiveInterest] = useState('All');
  const [sourceFilter, setSourceFilter] = useState(null); // null | Youtube | eBay
  const [addingInterest, setAddingInterest] = useState(false);
  const [newInterest, setNewInterest] = useState('');

  const userInterestTags = user?.interests?.length
    ? user.interests.map((i) => i.tag)
    : (user?.categories || []).map((c) => c.tag);

  const filteredItems = items.filter((item) => {
    const matchesInterest =
      activeInterest === 'All' || item.interest === activeInterest;
    const matchesSource = !sourceFilter || item.source === sourceFilter;
    return matchesInterest && matchesSource;
  });

  const submitAddInterest = async (e) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    await addInterest(newInterest.trim());
    setNewInterest('');
    setAddingInterest(false);
  };

  return (
    <div className="min-h-screen bg-base-300">
      {/* Top nav */}
      <div className="navbar bg-base-100 border-b border-base-content/10 px-6">
        <div className="flex-1">
          <span className="text-xl font-bold">NostalgiaBoard</span>
        </div>
        <div className="flex-none gap-6 hidden sm:flex">
          <span className="font-semibold">Feed</span>
          <Link to="/profile" className="opacity-60 hover:opacity-100">
            Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="opacity-60 hover:opacity-100"
          >
            Sign Out
          </button>
        </div>
        <div className="flex-none ml-6">
          <Link to="/profile">
            <User className="opacity-70 hover:opacity-100" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 p-6 border-b md:border-b-0 md:border-r border-base-content/10">
          <p className="text-xs font-semibold opacity-50 mb-3 tracking-wide">
            MY INTERESTS
          </p>
          <ul className="menu p-0 gap-1">
            <li>
              <a
                className={activeInterest === 'All' ? 'active' : ''}
                onClick={() => setActiveInterest('All')}
              >
                <Grip size={18} /> All
              </a>
            </li>
            {userInterestTags.map((tag) => (
              <li key={tag}>
                <a
                  className={activeInterest === tag ? 'active' : ''}
                  onClick={() => setActiveInterest(tag)}
                >
                  {tag}
                </a>
              </li>
            ))}
          </ul>

          {addingInterest ? (
            <form
              onSubmit={submitAddInterest}
              className="flex gap-2 items-center mt-3"
            >
              <input
                type="text"
                autoFocus
                placeholder="e.g. Pokemon"
                className="input input-bordered input-sm w-full"
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
              className="btn btn-outline btn-sm w-full mt-3"
              onClick={() => setAddingInterest(true)}
            >
              + Add interest
            </button>
          )}

          <p className="text-xs font-semibold opacity-50 mt-6 mb-3 tracking-wide">
            FILTER BY
          </p>
          <ul className="menu p-0 gap-1">
            <li>
              <a
                className={sourceFilter === 'YouTube' ? 'active' : ''}
                onClick={() =>
                  setSourceFilter(sourceFilter === 'YouTube' ? null : 'YouTube')
                }
              >
                YouTube only
              </a>
            </li>
            <li>
              <a
                className={sourceFilter === 'eBay' ? 'active' : ''}
                onClick={() =>
                  setSourceFilter(sourceFilter === 'eBay' ? null : 'eBay')
                }
              >
                eBay only
              </a>
            </li>
          </ul>
        </aside>

        {/* Feed grid */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="opacity-70">
              Showing results for{' '}
              {activeInterest === 'All' ? 'all interests' : activeInterest}
            </p>
            <p className="text-sm opacity-50">eBay + YouTube</p>
          </div>

          {error && (
            <div className="alert alert-error text-sm mb-4">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <p className="opacity-60">Loading your feed...</p>
          ) : filteredItems.length === 0 ? (
            <p className="opacity-60">
              No results yet. Try adding more interests, or check back later.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <ItemCard
                  key={`${item.source}-${item.externalId}`}
                  item={item}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default FeedPage;
