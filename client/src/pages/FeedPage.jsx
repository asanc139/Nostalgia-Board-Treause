import { useState } from 'react';
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
  const { user, items, loading, error, toggleSave } = useFeed();
  const [activeInterest, setActiveInterest] = useState('All');
  const [sourceFilter, setSourceFilter] = useState(null); // null | Youtube | eBay

  const userInterests = user?.interests?.length
    ? user.interests
    : user?.categories || [];

  const filteredItems = items.filter((item) => {
    const matchesInterest =
      activeInterest === 'All' || item.interest === activeInterest;
    const matchesSource = !sourceFilter || item.source === sourceFilter;
    return matchesInterest && matchesSource;
  });

  return (
    <div className="min-h-screen bg-base-300">
      {/* Top nav */}
      <div className="navbar bg-base-100 border-b border-base-content/10 px-6">
        <div className="flex-1">
          <span className="text-xl font-bold">NostalgiaBoard</span>
        </div>
        <div className="flex-none gap-6 hidden sm:flex">
          <a className="font-semibold">Feed</a>
          <a className="opacity-60">Saved</a>
        </div>
        <div className="flex-none ml-6">
          <User className="opacity-70" />
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
            {userInterests.map((interest) => (
              <li key={interest}>
                <a
                  className={activeInterest === interest ? 'active' : ''}
                  onClick={() => setActiveInterest(interest)}
                >
                  {interest}
                </a>
              </li>
            ))}
          </ul>

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
              No results yet. Try adding more interests during signup, or check
              back later.
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
