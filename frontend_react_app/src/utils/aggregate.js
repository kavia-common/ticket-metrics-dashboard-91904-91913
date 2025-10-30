import { format, parse } from 'date-fns';

/**
 * PUBLIC_INTERFACE
 * aggregateByAppMonth
 * Groups normalized rows by application+monthKey and averages metrics; sums volumes.
 */
export function aggregateByAppMonth(rows = []) {
  /** This is a public function. */
  const map = new Map();
  rows.forEach(r => {
    const key = `${r.application}__${r.monthKey}`;
    if (!map.has(key)) {
      map.set(key, {
        application: r.application,
        monthKey: r.monthKey,
        monthLabel: r.monthLabel,
        received: 0,
        responded: 0,
        resolved: 0,
        respondAdherence: 0,
        resolveAdherence: 0,
        mttrRespond: 0,
        mttrResolve: 0,
        _count: 0
      });
    }
    const agg = map.get(key);
    agg.received += Number(r.received || 0);
    agg.responded += Number(r.responded || 0);
    agg.resolved += Number(r.resolved || 0);
    agg.respondAdherence += Number(r.respondAdherence || 0);
    agg.resolveAdherence += Number(r.resolveAdherence || 0);
    agg.mttrRespond += Number(r.mttrRespond || 0);
    agg.mttrResolve += Number(r.mttrResolve || 0);
    agg._count += 1;
  });

  const out = Array.from(map.values()).map(a => {
    const cnt = a._count || 1;
    return {
      application: a.application,
      monthKey: a.monthKey,
      monthLabel: a.monthLabel,
      received: a.received,
      responded: a.responded,
      resolved: a.resolved,
      respondAdherence: +(a.respondAdherence / cnt).toFixed(2),
      resolveAdherence: +(a.resolveAdherence / cnt).toFixed(2),
      mttrRespond: +(a.mttrRespond / cnt).toFixed(2),
      mttrResolve: +(a.mttrResolve / cnt).toFixed(2),
    };
  });

  // Sort by month then application
  out.sort((x, y) => {
    if (x.monthKey === y.monthKey) return x.application.localeCompare(y.application);
    return x.monthKey.localeCompare(y.monthKey);
  });

  return out;
}

/**
 * PUBLIC_INTERFACE
 * buildFilterOptions
 * Derives unique application list and distinct months from normalized rows.
 */
export function buildFilterOptions(rows = []) {
  /** This is a public function. */
  const appSet = new Set();
  const monthMap = new Map(); // value: label
  rows.forEach(r => {
    appSet.add(r.application);
    monthMap.set(r.monthKey, r.monthLabel);
  });
  const applications = Array.from(appSet).sort();
  const months = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([value, label]) => ({ value, label }));
  return { applications, months };
}

/**
 * PUBLIC_INTERFACE
 * filterNormalizedRows
 * Filters normalized rows by applications (any) and month range.
 */
export function filterNormalizedRows(rows = [], filters = {}) {
  /** This is a public function. */
  const apps = filters.applications || [];
  const start = filters.monthStart || null;
  const end = filters.monthEnd || null;

  return rows.filter(r => {
    const appOk = apps.length ? apps.includes(r.application) : true;
    const monthOk =
      (!start || r.monthKey >= start) &&
      (!end || r.monthKey <= end);
    return appOk && monthOk;
  });
}

/**
 * PUBLIC_INTERFACE
 * monthRangeFromData
 * Returns {start, end} from aggregated rows.
 */
export function monthRangeFromData(agg = []) {
  /** This is a public function. */
  if (!agg.length) return null;
  let min = agg[0].monthKey;
  let max = agg[0].monthKey;
  agg.forEach(a => {
    if (a.monthKey < min) min = a.monthKey;
    if (a.monthKey > max) max = a.monthKey;
  });
  return { start: min, end: max };
}
