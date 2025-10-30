import React, { useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';

/**
 * SLAOverviewView
 * Multi-line chart for response vs resolution adherence rates.
 *
 * PUBLIC_INTERFACE
 */
export default function SLAOverviewView({ data = [], onPointClick }) {
  const chartData = useMemo(() => {
    return data.map(d => ({
      name: `${d.application} ${d.monthLabel}`,
      application: d.application,
      monthKey: d.monthKey,
      response: Number(d.respondAdherence || 0),
      resolution: Number(d.resolveAdherence || 0),
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
        <LineChart data={chartData} onClick={handleClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" hide />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="response" name="Response Adherence %" stroke="#2563EB" dot />
          <Line type="monotone" dataKey="resolution" name="Resolution Adherence %" stroke="#F59E0B" dot />
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-caption">Click a point to drill down</div>
    </div>
  );
}
