import React, { useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';

/**
 * TicketVolumeView
 * Shows received vs responded bars and line for resolved over time.
 *
 * PUBLIC_INTERFACE
 */
export default function TicketVolumeView({ data = [], onPointClick }) {
  const chartData = useMemo(() => {
    // Map to keys for chart
    return data.map(d => ({
      name: `${d.application} ${d.monthLabel}`,
      application: d.application,
      monthKey: d.monthKey,
      received: Number(d.received || 0),
      responded: Number(d.responded || 0),
      resolved: Number(d.resolved || 0),
    }));
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
          <Bar dataKey="received" name="Received" fill="#2563EB" />
          <Bar dataKey="responded" name="Responded" fill="#F59E0B" />
          <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10B981" dot />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="chart-caption">Click a point/bar to drill down</div>
    </div>
  );
}
