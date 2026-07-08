import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';

function LoginForm() {
  return (
    <section className="flex justify-center items-center bg-base-200 px-6 py-10 sm:px-10">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            Treasure Awaits!
          </h2>

          <p className="text-center text-xl mb-8">Log in to your account</p>

          <input
            type="email"
            placeholder="Email address"
            className="input input-bordered input-lg w-full"
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered input-lg w-full mt-4"
          />

          <button className="btn btn-primary btn-lg mt-6">Log In</button>

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
