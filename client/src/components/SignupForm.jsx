import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DECADES = ['80s', '90s', '200s'];
const CATEGORIES = [
  'TV shows',
  'Video games',
  'Movies',
  'Comics',
  'Sports',
  'Collectibles',
  'Memorabilia',
];

export default function SignupForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step1Done, setStep1Done] = useState(false);

  const [decade, setDecade] = useState(null);

  const [categories, setCategories] = useState([]);
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setStep1Done(true);
  };
  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const addInterest = (e) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      if (!interests.includes(interestInput.trim())) {
        setInterests((prev) => [...prev, interestInput.trim()]);
      }
      setInterestInput('');
    }
  };
  const removeInterest = (tag) => {
    setInterests((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          decade,
          categories,
          interests,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong here.');
      }
      navigate('/feed');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center items-center bg-base-200 px-6 py-10 sm:px-10 min-h-screen">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            Create your account
          </h2>

          {error && (
            <div className="alert alert-error text-sm mt-4">
              <span>{error}</span>
            </div>
          )}

          {/* Step 1 */}
          <p className="text-sm opacity-70 mt-6 mb-2">
            Step 1 of 3 — Basic info
          </p>

          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step1Done}
          />

          <label className="label mt-2">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={step1Done}
          />

          {!step1Done && (
            <button
              className="btn btn-primary w-full mt-6"
              onClick={handleContinue}
            >
              Continue
            </button>
          )}

          {/* Step 2 */}
          {step1Done && (
            <>
              <div className="divider"></div>
              <p className="text-sm opacity-70 mb-2">
                Step 2 of 3 — Which decade did you grow up in?
              </p>
              <div className="flex gap-2 flex-wrap">
                {DECADES.map((d) => (
                  <button
                    key={d}
                    className={`btn flex-1 ${decade === d ? 'btn-active' : 'btn-outline'}`}
                    onClick={() => setDecade(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3 */}
          {step1Done && decade && (
            <>
              <div className="divider"></div>
              <p className="text-sm opacity-70 mb-2">
                Step 3 of 3 — What were you into?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${categories.includes(cat) ? 'btn-active' : 'btn-outline'}`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <label className="label mt-4">
                <span className="label-text">
                  Add a specific interest (e.g. "DuckTales")
                </span>
              </label>
              <input
                type="text"
                placeholder="Type and press enter..."
                className="input input-bordered w-full"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={addInterest}
              />

              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {interests.map((tag) => (
                    <span key={tag} className="badge badge-lg gap-2">
                      {tag}
                      <button onClick={() => removeInterest(tag)}>✕</button>
                    </span>
                  ))}
                </div>
              )}

              <button
                className="btn btn-primary w-full mt-6"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Creating account...' : 'Go to Feed →'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
