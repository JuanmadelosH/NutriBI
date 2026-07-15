import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

// Espera productos con .costoReal ya calculado (ver ProductGrid)
export default function MarginByProductChart({ productos }) {
  if (!productos || productos.length === 0) {
    return <div className="empty-state">Aún no hay productos registrados.</div>;
  }
  const margenes = productos.map((p) => {
    const costo = p.costoReal ?? 0;
    return p.precio_venta ? ((p.precio_venta - costo) / p.precio_venta) * 100 : 0;
  });
  const chartData = {
    labels: productos.map((p) => p.nombre),
    datasets: [{
      label: 'Margen %',
      data: margenes,
      backgroundColor: margenes.map((m) => (m >= 0 ? '#4FA672' : '#C4453A')),
      borderRadius: 3,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Margen % por producto', color: '#EFEBE1', font: { family: "'Fraunces',serif", size: 13, weight: '600' } },
    },
    scales: {
      x: { grid: { color: '#233A2F' }, ticks: { color: '#9FB3A6', font: { family: "'JetBrains Mono', monospace", size: 10.5 } } },
      y: { grid: { display: false }, ticks: { color: '#9FB3A6', font: { family: "'Inter',sans-serif", size: 11 } } },
    },
  };
  return <Bar data={chartData} options={options} />;
}
