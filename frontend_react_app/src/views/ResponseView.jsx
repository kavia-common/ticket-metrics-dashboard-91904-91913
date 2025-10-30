import React, { useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';

/**
 * ResponseView
 * Stacked bar for response adherence vs slipped and line for MTTR (Respond).
 *
 * PUBLIC_INTERFACE
 */
export default function ResponseView({ data = [], onPointClick }) {
  const chartData = useMemo(() => {
    return data.map(d => {
      const adh = Number(d.respondAdherence || 0);
      return {
        name: `${d.application} ${d.monthLabel}`,
        application: d.application,
        monthKey: d.monthKey,
        adherence: adh,
        slipped: Math.max(0, 100 - adh),
        mttrRespond: Number(d.mttrRespond || 0)
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
          <Line type="monotone" dataKey="mttrRespond" name="MTTR (Respond)" stroke="#2563EB" dot />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="chart-caption">Click a point/bar to drill down</div>
    </div>
  );
}
