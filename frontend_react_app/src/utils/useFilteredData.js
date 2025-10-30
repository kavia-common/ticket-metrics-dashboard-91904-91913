import { useMemo } from 'react';
import { aggregateByAppMonth, buildFilterOptions, filterNormalizedRows, monthRangeFromData } from './aggregate';

/**
 * PUBLIC_INTERFACE
 * useFilteredData
 * Central selector/hook that computes a single source of truth for all derived values from
 * normalizedRows + filters. It returns:
 *  - options: { applications, months }
 *  - monthRange: { start, end } from data
 *  - filteredRows: row-level entries filtered by application and month range
 *  - filteredAgg: aggregated data by Application+Month for all charts
 *  - summary: totals and averages for panels
 *  - receivedByApp: Map of application -> total received (for gauge and total panel)
 *  - currentValue: tickets value to display (follows single selected app, else overall)
 *  - maxValue: max tickets across selected apps (for gauge scale)
 */
export function useFilteredData(normalizedRows = [], filters = {}) {
  // Build dropdown options from all rows (not filtered)
  const options = useMemo(() => buildFilterOptions(normalizedRows), [normalizedRows]);

  // Filter rows per current filters and re-aggregate
  const filteredRows = useMemo(
    () => filterNormalizedRows(normalizedRows, filters),
    [normalizedRows, filters]
  );

  const filteredAgg = useMemo(
    () => aggregateByAppMonth(filteredRows),
    [filteredRows]
  );

  // Month range based on aggregated data
  const monthRange = useMemo(() => monthRangeFromData(filteredAgg), [filteredAgg]);

  // Summary totals/averages for current context
  const summary = useMemo(() => {
    if (!filteredAgg.length) {
      return { totalTickets: 0, avgRespondMTTR: 0, avgResolveMTTR: 0, respondAdh: 0, resolveAdh: 0 };
    }
    const totals = filteredAgg.reduce(
      (acc, r) => {
        acc.totalTickets += Number(r.received || 0);
        acc.respondMTTR += Number(r.mttrRespond || 0);
        acc.resolveMTTR += Number(r.mttrResolve || 0);
        acc.respondAdh += Number(r.respondAdherence || 0);
        acc.resolveAdh += Number(r.resolveAdherence || 0);
        return acc;
      },
      { totalTickets: 0, respondMTTR: 0, resolveMTTR: 0, respondAdh: 0, resolveAdh: 0 }
    );
    const n = filteredAgg.length;
    return {
      totalTickets: totals.totalTickets,
      avgRespondMTTR: +(totals.respondMTTR / n).toFixed(2),
      avgResolveMTTR: +(totals.resolveMTTR / n).toFixed(2),
      respondAdh: +(totals.respondAdh / n).toFixed(2),
      resolveAdh: +(totals.resolveAdh / n).toFixed(2),
    };
  }, [filteredAgg]);

  // App -> sum(received) over filteredAgg
  const receivedByApp = useMemo(() => {
    const map = new Map();
    filteredAgg.forEach(a => {
      map.set(a.application, (map.get(a.application) || 0) + Number(a.received || 0));
    });
    return map;
  }, [filteredAgg]);

  // Determine currentValue and maxValue for gauge and total
  const { currentValue, maxValue } = useMemo(() => {
    const selectedApps = filters.applications || [];
    const hasSingleApp = selectedApps.length === 1;

    const curApp = hasSingleApp ? selectedApps[0] : null;
    const value = hasSingleApp
      ? (receivedByApp.get(curApp) || 0)
      : Array.from(receivedByApp.values()).reduce((s, n) => s + n, 0);

    const max = receivedByApp.size
      ? Math.max(...Array.from(receivedByApp.values()))
      : Math.max(1, Number(summary.totalTickets || 1));

    return { currentValue: value, maxValue: max || 1 };
  }, [filters.applications, receivedByApp, summary.totalTickets]);

  return {
    options,
    monthRange,
    filteredRows,
    filteredAgg,
    summary,
    receivedByApp,
    currentValue,
    maxValue,
  };
}
