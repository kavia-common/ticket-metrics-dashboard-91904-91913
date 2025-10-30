import React, { useMemo } from 'react';

/**
 * FiltersBar
 * Renders Application multi-select and Month range selects.
 *
 * PUBLIC_INTERFACE
 */
export default function FiltersBar({ options, filters, onChange, disabled }) {
  const { applications = [], months = [] } = options || {};

  const monthOptions = useMemo(() => months || [], [months]);

  const handleAppsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value);
    onChange({ ...filters, applications: selected });
  };

  const handleStartChange = (e) => {
    onChange({ ...filters, monthStart: e.target.value || null });
  };

  const handleEndChange = (e) => {
    onChange({ ...filters, monthEnd: e.target.value || null });
  };

  return (
    <div className="filter-bar" role="region" aria-label="Chart filters">
      <div className="filter-group">
        <label className="filter-label" htmlFor="apps">Applications</label>
        <select
          id="apps"
          className="select"
          multiple
          size={Math.min(6, Math.max(3, applications.length))}
          value={filters.applications || []}
          onChange={handleAppsChange}
          disabled={disabled || applications.length === 0}
          aria-label="Select Applications"
        >
          {applications.map(app => (
            <option key={app} value={app}>{app}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="monthStart">Month start</label>
        <select
          id="monthStart"
          className="select"
          value={filters.monthStart || ''}
          onChange={handleStartChange}
          disabled={disabled || monthOptions.length === 0}
          aria-label="Select start month"
        >
          <option value="">Any</option>
          {monthOptions.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="monthEnd">Month end</label>
        <select
          id="monthEnd"
          className="select"
          value={filters.monthEnd || ''}
          onChange={handleEndChange}
          disabled={disabled || monthOptions.length === 0}
          aria-label="Select end month"
        >
          <option value="">Any</option>
          {monthOptions.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
