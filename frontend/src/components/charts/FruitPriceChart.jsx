import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const COLORES = ['#E2891F', '#9B5FA0', '#D9B227', '#4FA672', '#C4453A'];

// Espera insumos de tipo "Fruta" con su historial:
// insumosFruta: [{ id_insumo, nombre, historial: [{ semana: '2026-01-05', costo_unitario: 3800 }, ...] }]
export default function FruitPriceChart({ insumosFruta }) {
  if (!insumosFruta || insumosFruta.length === 0) {
    return <div className="empty-state">Registra insumos de tipo "Fruta" y sus precios semanales.</div>;
  }
  const semanas = [...new Set(insumosFruta.flatMap((i) => i.historial.map((h) => h.semana)))].sort();
  const chartData = {
    labels: semanas,
    datasets: insumosFruta.map((ins, idx) => ({
      label: ins.nombre,
      data: semanas.map((s) => {
        const row = ins.historial.find((h) => h.semana === s);
        return row ? row.costo_unitario : null;
      }),
      borderColor: COLORES[idx % COLORES.length],
      backgroundColor: 'transparent',
      tension: 0.3,
      pointRadius: 2,
      borderWidth: 2,
      spanGaps: true,
    })),
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9FB3A6', font: { family: "'JetBrains Mono', monospace", size: 10.5 }, maxTicksLimit: 8 } },
      y: { grid: { color: '#233A2F' }, ticks: { color: '#9FB3A6', font: { family: "'JetBrains Mono', monospace", size: 10.5 } } },
    },
  };
  return <Line data={chartData} options={options} />;
}
