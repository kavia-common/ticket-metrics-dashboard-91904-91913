import React, { useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';

/**
 * ResolutionView
 * Stacked bar for resolution adherence vs slipped and line for MTTR (Resolve).
 *
 * PUBLIC_INTERFACE
 */
export default function ResolutionView({ data = [], onPointClick }) {
  const chartData = useMemo(() => {
    return data.map(d => {
      const adh = Number(d.resolveAdherence || 0);
      return {
        name: `${d.application} ${d.monthLabel}`,
        application: d.application,
        monthKey: d.monthKey,
        adherence: adh,
        slipped: Math.max(0, 100 - adh),
        mttrResolve: Number(d.mttrResolve || 0)
      };
    });
  }, [data]);

  const handleClick = (e) => {
    if (!e || !e.activePayload) return;
    const p = e.activePayload[0]?.payload;
    if (p && onPointClick) onPointClick(p.application, p.monthKey);
  };

  return (
    <div className="chart-box">
      <div className="chart-grid-bg" />
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={chartData} onClick={handleClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar stackId="a" dataKey="adherence" name="Adherence %" fill="#10B981" />
          <Bar stackId="a" dataKey="slipped" name="Slipped %" fill="#EF4444" />
          <Line type="monotone" dataKey="mttrResolve" name="MTTR (Resolve)" stroke="#F59E0B" dot />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="chart-caption">Click a point/bar to drill down</div>
    </div>
  );
}
