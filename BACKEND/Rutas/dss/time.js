// Rutas/dss/time.js  — versión sin date-fns(-tz)
const TZ = process.env.TZ_BACKEND || 'America/Bogota';

// convierte a hora local de TZ
const toZoned = (d) =>
  new Date(new Date(d).toLocaleString('en-US', { timeZone: TZ }));

function normalizeRange(from, to) {
  const end = to ? new Date(to) : new Date();
  const start = from ? new Date(from) : new Date(end.getFullYear() - 10, end.getMonth(), 1);
  return { start, end };
}

function startOfDay(d) {
  const z = toZoned(d);
  z.setHours(0,0,0,0);
  return z;
}
function startOfWeek(d) { // ISO: lunes
  const z = startOfDay(d);
  const dow = z.getDay() || 7; // 1..7
  z.setDate(z.getDate() - (dow - 1));
  return z;
}
function startOfMonth(d) {
  const z = toZoned(d);
  return new Date(z.getFullYear(), z.getMonth(), 1);
}

function addDays(d, n)  { const x = new Date(d); x.setDate(x.getDate()+n); return x; }
function addWeeks(d, n) { return addDays(d, n*7); }
function addMonths(d,n) { const x = new Date(d); x.setMonth(x.getMonth()+n); return x; }

function buckets(range, interval) {
  const pts = [];
  let cur =
    interval === 'day'   ? startOfDay(range.start)  :
    interval === 'week'  ? startOfWeek(range.start) :
                           startOfMonth(range.start);
  const add = interval === 'day' ? addDays : interval === 'week' ? addWeeks : addMonths;
  while (cur <= range.end) { pts.push(new Date(cur)); cur = add(cur, 1); }
  return pts;
}

// ISO week-year y número de semana
function isoWeekInfo(date) {
  const d = startOfDay(date);
  // mover al jueves de esa semana
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { year: d.getFullYear(), week };
}

function pad(n) { return String(n).padStart(2,'0'); }

function label(d, interval) {
  const z = toZoned(d);
  const y = z.getFullYear();
  const m = pad(z.getMonth()+1);
  const dd = pad(z.getDate());
  if (interval === 'day')  return `${y}-${m}-${dd}`;
  if (interval === 'week') {
    const { year, week } = isoWeekInfo(z);
    return `${year}-W${pad(week)}`;
  }
  return `${y}-${m}`; // month
}

module.exports = { normalizeRange, buckets, label };
