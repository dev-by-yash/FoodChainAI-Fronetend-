export default function Sidebar() {
  return (
    <div className="w-64 bg-black text-white p-5">
      <h2 className="text-2xl font-bold mb-6">FoodChain AI</h2>

      <ul className="space-y-4">
        <li className="hover:text-gray-400 cursor-pointer">Dashboard</li>
        <li className="hover:text-gray-400 cursor-pointer">Upload Bill</li>
        <li className="hover:text-gray-400 cursor-pointer">Analytics</li>
        <li className="hover:text-gray-400 cursor-pointer">Donations</li>
      </ul>
    </div>
  );
}