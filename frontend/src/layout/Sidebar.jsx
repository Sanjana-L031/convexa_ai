import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-6">Convexa AI</h2>

      <nav className="space-y-4">
        <Link to="/" className="block hover:text-blue-400">Dashboard</Link>
        <Link to="/campaigns" className="block hover:text-blue-400">Campaigns</Link>
        <Link to="/analytics" className="block hover:text-blue-400">Analytics</Link>
      </nav>
    </div>
  );
}