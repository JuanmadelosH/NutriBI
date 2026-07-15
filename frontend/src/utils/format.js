export const fmtCOP = (n) => '$' + Math.round(n || 0).toLocaleString('es-CO');

export const fmtDate = (d) => {
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

export function mondayOnOrBefore(d) {
  const nd = new Date(d);
  if (isNaN(nd.getTime())) return new Date();
  const day = nd.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  nd.setUTCDate(nd.getUTCDate() - diff);
  return nd;
}

export const todayStr = () => fmtDate(new Date());
