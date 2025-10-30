import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TotalTicketsPanel
 * Displays the "Total Tickets" metric sourced from the same selector logic as the Gauge.
 *
 * Props:
 * - title?: string
 * - value: number
 * - subtitle?: string
 */
export default function TotalTicketsPanel({ title = 'Total Tickets', value = 0, subtitle = 'Source: "No of Tickets Received"' }) {
  return (
    <div className="metric-card tone-primary" style={{ height: '100%' }}>
      <div className="metric-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <span aria-hidden="true">🎟️</span>
      </div>
      <div className="metric-value" style={{ color: 'var(--color-primary)' }}>
        {Number(value || 0).toLocaleString()}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(17,24,39,0.65)', marginTop: 6 }}>
        {subtitle}
      </div>
    </div>
  );
}
