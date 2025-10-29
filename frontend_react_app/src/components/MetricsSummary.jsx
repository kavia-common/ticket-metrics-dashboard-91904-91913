import React from 'react';

/**
 * MetricsSummary
 * Displays summary cards for key ticket metrics.
 *
 * Props:
 * - metrics: { total: number, resolved: number, pending: number }
 */
// PUBLIC_INTERFACE
export default function MetricsSummary({ metrics = { total: 0, resolved: 0, pending: 0 } }) {
  const items = [
    { label: 'Total Tickets', value: metrics.total, tone: 'primary' },
    { label: 'Resolved', value: metrics.resolved, tone: 'success' },
    { label: 'Pending', value: metrics.pending, tone: 'warning' }
  ];

  return (
    <div className="metrics-grid">
      {items.map((it) => (
        <div key={it.label} className={`metric-card tone-${it.tone}`}>
          <div className="metric-label">{it.label}</div>
          <div className="metric-value">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
