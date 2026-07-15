import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip);

// filas: array de objetos devueltos por el backend tras ejecutar el SQL generado
// chart: { type: 'bar' | 'line' | 'table', x: 'columna', y: 'columna' }
export default function ResultChart({ filas, chart }) {
  if (!filas || filas.length === 0) {
    return <div className="status-line">La consulta no devolvió filas.</div>;
  }
  if (!chart || chart.type === 'table' || !chart.x || !chart.y) {
    const cols = Object.keys(filas[0]);
    return (
      <div style={{ marginTop: 10, maxHeight: 260, overflow: 'auto' }}>
        <table className="datatable">
          <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {filas.slice(0, 25).map((r, i) => (
              <tr key={i}>{cols.map((c) => <td key={c}>{String(r[c])}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  const data = {
    labels: filas.map((r) => r[chart.x]),
    datasets: [{
      label: chart.y,
      data: filas.map((r) => r[chart.y]),
      backgroundColor: '#E2891F',
      borderColor: '#E2891F',
      tension: 0.3,
      borderRadius: 3,
      maxBarThickness: 30,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9FB3A6', font: { size: 10 } } },
      y: { grid: { color: '#233A2F' }, ticks: { color: '#9FB3A6', font: { size: 10 } } },
    },
  };
  const Comp = chart.type === 'line' ? Line : Bar;
  return (
    <div className="result-chart">
      <Comp data={data} options={options} />
    </div>
  );
}
