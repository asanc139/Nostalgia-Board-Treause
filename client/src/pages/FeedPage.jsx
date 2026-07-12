import { useState } from 'react';
import { Play, Tag, Gamepad2, BookOpen, Grip, User } from 'lucide-react';

const MOCK_ITEMS = [
  {
    id: 1,
    source: 'YouTube',
    icon: 'play',
    title: 'DuckTales — full episode (1987)',
    meta: '15:24 · YouTube',
    interest: 'DuckTales',
  },
  {
    id: 2,
    source: 'eBay',
    icon: 'tag',
    title: 'DuckTales NES cartridge — complete in box',
    meta: '$42.00 · eBay',
    interest: 'DuckTales',
  },
  {
    id: 3,
    source: 'YouTube',
    icon: 'gamepad',
    title: 'Sega Genesis — top 10 games of all time',
    meta: '22:01 · YouTube',
    interest: 'Sega Genesis',
  },
  {
    id: 4,
    source: 'eBay',
    icon: 'tag',
    title: 'Sega Genesis console — model 1 w/ cables',
    meta: '$89.99 · eBay',
    interest: 'Sega Genesis',
  },
  {
    id: 5,
    source: 'eBay',
    icon: 'book',
    title: 'X-Men #1 (1991) — Jim Lee cover, VF',
    meta: '$34.00 · eBay',
    interest: 'X-Men comics',
  },
  {
    id: 6,
    source: 'YouTube',
    icon: 'play',
    title: 'X-Men animated series intro (1992)',
    meta: '1:32 · YouTube',
    interest: 'X-Men comics',
  },
];

const ICONS = {
  play: Play,
  tag: Tag,
  gamepad: Gamepad2,
  book: BookOpen,
};

function ItemCard({ item, saved, onToggleSave }) {
  const Icon = ICONS[item.icon];

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="relative bg-neutral h-36 flex items-center justify-center rounded-t-box">
        <Icon className="opacity-40" size={40} />
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
        <p className="font-semibold leading-snug">{item.title}</p>
        <p className="text-sm opacity-60">{item.meta}</p>
        <button
          className={`btn btn-outline btn-sm mt-2 ${saved ? 'btn-active' : ''}`}
          onClick={() => onToggleSave(item.id)}
        >
          {saved ? '♥ Saved' : '♡ Save'}
        </button>
      </div>
    </div>
  );
}

function FeedPage() {
  const [activeInterest, setActiveInterest] = useState('All');
  const [sourceFilter, setSourceFilter] = useState(null); // null | 'YouTube' | 'eBay'
  const [savedIds, setSavedIds] = useState([1]); // mock: item 1 pre-saved, like your screenshot

  const userInterests = ['DuckTales', 'Sega Genesis', 'X-Men comics']; // mock, will come from user profile later

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const filteredItems = MOCK_ITEMS.filter((item) => {
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

          <button className="btn btn-outline btn-sm w-full mt-6">
            + Add interest
          </button>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                saved={savedIds.includes(item.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default FeedPage;
