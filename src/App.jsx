import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Productivity Dashboard</h1>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
