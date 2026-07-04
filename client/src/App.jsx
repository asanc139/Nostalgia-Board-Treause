import useItems from './hooks/useItems';

import LandingPanel from './components/LandingPanel';
import LoginForm from './components/LoginForm';
function App() {
  const { items, loading, error } = useItems();

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-base-300 flex flex-col">
      <main className="flex-1">
        <div className="grid lg:grid-cols-2 grid-cols-1 min-h-screen">
          <LandingPanel />
          <LoginForm />
        </div>
      </main>

      <h1>My Items</h1>
      {items.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
