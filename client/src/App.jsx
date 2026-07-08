import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useItems from './hooks/useItems';

import LandingPanel from './components/LandingPanel';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Footer from './components/Footer';

function Home() {
  const { items, loading, error } = useItems();

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <main className="flex-1">
        <div className="grid lg:grid-cols-2 grid-cols-1 min-h-screen">
          <LandingPanel />
          <LoginForm />
        </div>
      </main>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Items</h1>
        {items.map((item) => (
          <div key={item.id} className="mb-2">
            <h2 className="font-semibold">{item.name}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-300 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
