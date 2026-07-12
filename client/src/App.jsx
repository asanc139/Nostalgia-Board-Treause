import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import useItems from './hooks/useItems';

import LandingPanel from './components/LandingPanel';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import FeedPage from './pages/FeedPage';

function Home() {
  return (
    <main className="flex-1">
      <div className="grid lg:grid-cols-2 grid-cols-1 min-h-screen">
        <LandingPanel />
        <LoginForm />
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-300 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/feed"
            element={
              //The ProtectedRoute checks for a valid token before rendering the feed page
              <ProtectedRoute>
                <FeedPage />{' '}
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
