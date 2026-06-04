export default function AIInsights({ data }) {
  if (data.length === 0) return null;

  const total = data.length;
  const wasted = data.filter((item) => item.wasted).length;
  const percent = ((wasted / total) * 100).toFixed(1);

  let message = "";

  if (percent < 20) {
    message = "🔥 Great! Very low food waste.";
  } else if (percent < 50) {
    message = "[CAUTION] Moderate waste. Try better planning.";
  } else {
    message = "[HIGH] High waste! Reduce food purchase.";
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-4">
      <h2 className="text-lg font-bold mb-2">AI Insights 🤖</h2>
      <p>Total Items: {total}</p>
      <p>Wasted: {wasted}</p>
      <p>Waste %: {percent}%</p>
      <p className="mt-2 font-semibold">{message}</p>
    </div>
  );
}
