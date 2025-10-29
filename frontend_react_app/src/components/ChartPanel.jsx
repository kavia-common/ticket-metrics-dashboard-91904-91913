import React from 'react';

/**
 * ChartPanel
 * Placeholder panel for future charts. Shows a message depending on whether data exists.
 *
 * Props:
 * - hasData: boolean
 */
// PUBLIC_INTERFACE
export default function ChartPanel({ hasData }) {
  return (
    <div className="chart-placeholder">
      {hasData ? (
        <div className="chart-box">
          <div className="chart-grid-bg" />
          <div className="chart-caption">Charts will appear here</div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-illustration" aria-hidden="true">📊</div>
          <div className="empty-title">No data yet</div>
          <div className="empty-desc">Upload an Excel file to visualize ticket trends.</div>
        </div>
      )}
    </div>
  );
}
