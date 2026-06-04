import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export default function WasteChart({ data }) {
  const wasted = data.filter((item) => item.wasted).length;
  const consumed = data.filter((item) => !item.wasted).length;

  const chartData = {
    labels: ["Wasted", "Consumed"],
    datasets: [
      {
        data: [wasted, consumed],
      },
    ],
  };

  return (
    <div className="w-80 mx-auto">
      <Pie data={chartData} />
    </div>
  );
}
