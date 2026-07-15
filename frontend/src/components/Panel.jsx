import KpiRow from './KpiRow';
import ProductGrid from './ProductGrid';
import SalesByMonthChart from './charts/SalesByMonthChart';
import MarginByProductChart from './charts/MarginByProductChart';
import FruitPriceChart from './charts/FruitPriceChart';
import { computeKpis, computeInsumosFruta, withCostoReal } from '../utils/metrics';

export default function Panel({ data }) {
  const { ventas, productos, insumos, recetas, preciosInsumo, ventasPorMes } = data;
  const kpis = computeKpis(ventas, productos, recetas, insumos, preciosInsumo);
  const insumosFruta = computeInsumosFruta(insumos, preciosInsumo);
  const productosConCosto = withCostoReal(productos, recetas, preciosInsumo);

  return (
    <div>
      <KpiRow kpis={kpis} />

      <div className="panel">
        <h2>Ventas y margen</h2>
        <p className="panel-sub">Histórico registrado</p>
        <div className="chart-grid">
          <div className="chart-wrap"><SalesByMonthChart data={ventasPorMes} /></div>
          <div className="chart-wrap"><MarginByProductChart productos={productosConCosto} /></div>
        </div>
      </div>

      <div className="panel">
        <h2>Evolución del precio de la fruta</h2>
        <p className="panel-sub">Costo semanal por kilogramo (COP) según los precios registrados</p>
        <div className="chart-wrap" style={{ height: 260 }}>
          <FruitPriceChart insumosFruta={insumosFruta} />
        </div>
      </div>

      <div className="panel">
        <h2>Ficha de costeo por producto</h2>
        <p className="panel-sub">Costo real vigente (receta + últimos precios de insumo) vs. precio de venta</p>
        <ProductGrid productos={productosConCosto} />
      </div>
    </div>
  );
}
