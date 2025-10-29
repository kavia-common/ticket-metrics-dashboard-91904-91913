import React from 'react';

/**
 * ChartPanel
 * Placeholder panel for future charts. Shows a message depending on whether data exists
 * and whether filters (application/month) are selected.
 *
 * Props:
 * - hasData: boolean
 * - application?: string
 * - month?: string
 */
// PUBLIC_INTERFACE
export default function ChartPanel({ hasData, application = '', month = '' }) {
  const hasSelections = Boolean(application) && Boolean(month);

  if (!hasData) {
    return (
      <div className="chart-placeholder">
        <div className="empty-state">
          <div className="empty-illustration" aria-hidden="true">📊</div>
          <div className="empty-title">No data yet</div>
          <div className="empty-desc">Upload an Excel file to visualize ticket trends.</div>
        </div>
      </div>
    );
  }

  if (!hasSelections) {
    return (
      <div className="chart-placeholder">
        <div className="empty-state">
          <div className="empty-illustration" aria-hidden="true">🎯</div>
          <div className="empty-title">Select filters to begin</div>
          <div className="empty-desc">
            Choose an Application and Month from the filter bar above to preview your chart.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-placeholder">
      <div className="chart-box" aria-label={`Chart for ${application} in ${month}`}>
        <div className="chart-grid-bg" />
        <div className="chart-caption">
          {application} — {month}
        </div>
      </div>
    </div>
  );
}
