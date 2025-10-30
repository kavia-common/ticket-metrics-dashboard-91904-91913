import { format, parse } from 'date-fns';
import { findCanonicalKey } from './csvSchema';

/**
 * PUBLIC_INTERFACE
 * normalizeRows
 * Converts raw CSV rows to canonical schema, coercing numbers and dates.
 * monthKey: YYYY-MM, monthLabel: MMM-yy
 */
export function normalizeRows(rows = []) {
  /** This is a public function. */
  return rows.map(r => {
    const mapped = {};
    // Map headers to canonical keys
    Object.keys(r).forEach(k => {
      const canon = findCanonicalKey(k.toLowerCase());
      if (canon) mapped[canon] = r[k];
    });

    // Required: application, month
    const application = String(mapped.application || r.Application || r.app || '').trim();

    // Parse month - accept formats like YYYY-MM, YYYY/MM, MMM-YY, MMM YYYY
    let monthInput = mapped.month || r.Month || r.month;
    let monthDate = null;

    const tryFormats = ['yyyy-MM', 'yyyy/MM', 'LLL-yy', 'LLL yy', 'MMM-yy', 'MMM yyyy', 'yyyyMM'];
    for (const f of tryFormats) {
      try {
        const d = parse(String(monthInput), f, new Date());
        if (String(d) !== 'Invalid Date') { monthDate = d; break; }
      } catch(e) { /* ignore */ }
    }
    if (!monthDate) {
      // last resort try Date constructor
      const d = new Date(monthInput);
      if (!isNaN(d.getTime())) monthDate = d;
    }

    let monthKey = '';
    let monthLabel = '';
    if (monthDate) {
      monthKey = format(monthDate, 'yyyy-MM');
      monthLabel = format(monthDate, 'LLL-yy');
    } else {
      // if not parseable, keep raw
      monthKey = String(monthInput || '').slice(0, 7);
      monthLabel = String(monthInput || '');
    }

    // Numeric coercions
    const toNum = (v) => {
      if (v === null || v === undefined || v === '') return 0;
      const s = String(v).replace(/[% ,]/g, '');
      const n = Number(s);
      return isNaN(n) ? 0 : n;
    };

    const received = toNum(mapped.received ?? r.received ?? r.Received);
    const responded = toNum(mapped.responded ?? r.responded ?? r.Responded);
    const resolved = toNum(mapped.resolved ?? r.resolved ?? r.Resolved);

    let respondAdherence = toNum(mapped.respondAdherence ?? r.respondAdherence ?? r['Resp Adh %']);
    let resolveAdherence = toNum(mapped.resolveAdherence ?? r.resolveAdherence ?? r['Res Adh %']);

    let mttrRespond = toNum(mapped.mttrRespond ?? r.mttrRespond ?? r['MTTR Respond']);
    let mttrResolve = toNum(mapped.mttrResolve ?? r.mttrResolve ?? r['MTTR Resolve']);

    // Normalize percentages if >1 but likely percentage number e.g., 85 -> 85
    // If <=1 assume decimal fraction; convert to %
    if (respondAdherence > 0 && respondAdherence <= 1) respondAdherence = +(respondAdherence * 100).toFixed(2);
    if (resolveAdherence > 0 && resolveAdherence <= 1) resolveAdherence = +(resolveAdherence * 100).toFixed(2);

    return {
      application: application || 'Unknown',
      monthKey,
      monthLabel,
      received,
      responded,
      resolved,
      respondAdherence,
      resolveAdherence,
      mttrRespond,
      mttrResolve,
      // retain raw for drilldowns if needed
      _raw: r
    };
  }).filter(r => r.application && r.monthKey);
}
