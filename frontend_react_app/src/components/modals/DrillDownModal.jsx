import React from 'react';

/**
 * DrillDownModal
 * Shows row-level entries for a selected Application+Month.
 *
 * PUBLIC_INTERFACE
 */
export default function DrillDownModal({ open, onClose, application, monthKey, rows = [] }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Drilldown details"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'grid', placeItems: 'center', zIndex: 100
      }}
      onClick={onClose}
    >
      <div
        className="panel"
        style={{ width: 'min(90vw, 900px)', maxHeight: '80vh', overflow: 'auto', background: 'var(--color-surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 className="panel-title" style={{ margin: 0 }}>
            Details — {application || 'All'} • {monthKey || 'All'}
          </h3>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(17,24,39,0.7)', marginBottom: 12 }}>
          Showing {rows.length} rows
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
              {['Application','Month','Received','Responded','Resolved','Resp Adh %','Res Adh %','MTTR Resp','MTTR Res'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border-color)' }}>{h}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-color)' }}>{r.application}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-color)' }}>{r.monthLabel}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-color)' }}>{r.received}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-color)' }}>{r.responded}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-color)' }}>{r.resolved}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-color)' }}>{r.respondAdherence}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-color)' }}>{r.resolveAdherence}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-color)' }}>{r.mttrRespond}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-color)' }}>{r.mttrResolve}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
