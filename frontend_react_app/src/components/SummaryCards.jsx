import React from 'react';

/**
 * SummaryCards
 * Shows key stats for current filter context plus export actions.
 *
 * PUBLIC_INTERFACE
 */
export default function SummaryCards({
  totalTickets = 0,
  avgRespondMTTR = 0,
  avgResolveMTTR = 0,
  respondAdh = 0,
  resolveAdh = 0,
  onExportCsv,
  onExportPdf,
  disabled
}) {
  const items = [
    { label: 'Total Tickets', value: totalTickets, tone: 'primary' },
    { label: 'Avg MTTR (Respond)', value: `${avgRespondMTTR} h`, tone: 'success' },
    { label: 'Avg MTTR (Resolve)', value: `${avgResolveMTTR} h`, tone: 'warning' },
    { label: 'Response Adherence', value: `${respondAdh}%`, tone: 'success' },
    { label: 'Resolution Adherence', value: `${resolveAdh}%`, tone: 'success' }
  ];

  return (
    <div>
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {items.slice(0,3).map((it) => (
          <div key={it.label} className={`metric-card tone-${it.tone}`}>
            <div className="metric-label">{it.label}</div>
            <div className="metric-value">{it.value}</div>
          </div>
        ))}
      </div>
      <div className="metrics-grid" style={{ marginTop: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        {items.slice(3).map((it) => (
          <div key={it.label} className={`metric-card tone-${it.tone}`}>
            <div className="metric-label">{it.label}</div>
            <div className="metric-value">{it.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="btn" onClick={onExportCsv} disabled={disabled}>Export CSV</button>
        <button className="btn" onClick={onExportPdf} disabled={disabled}>Export PDF (stub)</button>
      </div>
    </div>
  );
}
