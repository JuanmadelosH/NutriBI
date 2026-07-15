import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const monoFont = { family: "'JetBrains Mono', monospace", size: 10.5 };

// Espera: [{ mes: '2026-06', montoTotal: 1234000 }, ...]
export default function SalesByMonthChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="empty-state">Aún no hay ventas registradas.</div>;
  }
  const chartData = {
    labels: data.map((d) => d.mes),
    datasets: [{
      label: 'Ventas',
      data: data.map((d) => d.montoTotal),
      backgroundColor: '#E2891F',
      borderRadius: 3,
      maxBarThickness: 26,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Ventas por mes', color: '#EFEBE1', font: { family: "'Fraunces',serif", size: 13, weight: '600' } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9FB3A6', font: monoFont } },
      y: { grid: { color: '#233A2F' }, ticks: { color: '#9FB3A6', font: monoFont, callback: (v) => `${v / 1000}k` } },
    },
  };
  return <Bar data={chartData} options={options} />;
}
