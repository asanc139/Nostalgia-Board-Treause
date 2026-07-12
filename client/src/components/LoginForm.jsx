import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate, Link } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('API URL is:', import.meta.env.VITE_API_URL);
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed Buddy!');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/feed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center bg-base-200 px-6 py-10 sm:px-10">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            Treasure Awaits!
          </h2>

          <p className="text-center text-xl mb-8">Log in to your account</p>

          {error && (
            <div className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}

          <input
            type="email"
            placeholder="Email address"
            className="input input-bordered input-lg w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered input-lg w-full mt-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn btn-primary btn-lg mt-6"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <a className="link text-center mt-5" href="#">
            Forgot password?
          </a>

          <div className="divider">or</div>

          <button className="btn btn-outline w-full">
            <FcGoogle size={28} />
            Continue with Google
          </button>

          <div className="divider"></div>

          <p className="text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="link link-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
