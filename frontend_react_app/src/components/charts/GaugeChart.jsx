import React, { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * GaugeChart
 * A lightweight, dependency-free SVG gauge (semi-circle) that displays a value in the range [0, max].
 * Colors follow Ocean Professional theme: primary (#2563EB) for low-to-mid, secondary (#F59E0B) for higher ranges.
 *
 * Props:
 * - value: number (current value)
 * - max: number (maximum scale)
 * - title: string (label above)
 * - caption: string (small label below/inside)
 * - height: number (pixel height, default 240)
 */
export default function GaugeChart({ value = 0, max = 100, title = 'Gauge', caption = '', height = 240 }) {
  const safeMax = Math.max(1, Number(max) || 1);
  const safeVal = Math.max(0, Math.min(Number(value) || 0, safeMax));

  // SVG geometry
  const chart = useMemo(() => {
    const width = 480; // internal viewBox width
    const vbHeight = 260; // viewBox height to give space for labels
    const cx = width / 2;
    const cy = 220; // center y below to create a semi-circle arc visible in view
    const r = 180;
    const startAngle = Math.PI; // 180deg (left)
    const endAngle = 0;         // 0deg (right)

    const polarToCartesian = (cx0, cy0, radius, angle) => ({
      x: cx0 + radius * Math.cos(angle),
      y: cy0 + radius * Math.sin(angle)
    });

    // Background arc path (semi circle)
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const bgArc = [
      'M', start.x, start.y,
      'A', r, r, 0, 0, 1, end.x, end.y
    ].join(' ');

    // Value arc
    const ratio = safeVal / safeMax;
    const valAngle = startAngle + (endAngle - startAngle) * ratio;
    const vEnd = polarToCartesian(cx, cy, r, valAngle);
    const largeArc = ratio > 0.5 ? 1 : 0;
    const valArc = [
      'M', start.x, start.y,
      'A', r, r, 0, largeArc, 1, vEnd.x, vEnd.y
    ].join(' ');

    // Needle
    const needleLen = r - 16;
    const nx = cx + needleLen * Math.cos(valAngle);
    const ny = cy + needleLen * Math.sin(valAngle);

    // Color bands (background gradient impression)
    // We draw three faint arcs to simulate bands: low (0-33%), mid (33-66%), high(66-100%)
    const arcFor = (fromRatio, toRatio, color) => {
      const fromA = startAngle + (endAngle - startAngle) * fromRatio;
      const toA = startAngle + (endAngle - startAngle) * toRatio;
      const fromP = polarToCartesian(cx, cy, r, fromA);
      const toP = polarToCartesian(cx, cy, r, toA);
      const large = (toRatio - fromRatio) > 0.5 ? 1 : 0;
      return { d: ['M', fromP.x, fromP.y, 'A', r, r, 0, large, 1, toP.x, toP.y].join(' '), color };
    };

    const bands = [
      arcFor(0.0, 0.33, 'rgba(37, 99, 235, 0.25)'), // blue-ish
      arcFor(0.33, 0.66, 'rgba(37, 99, 235, 0.20)'), // lighter blue
      arcFor(0.66, 1.0, 'rgba(245, 158, 11, 0.30)'), // amber for high
    ];

    return {
      width,
      vbHeight,
      cx, cy, r,
      bgArc,
      valArc,
      nx, ny,
      bands
    };
  }, [safeVal, safeMax]);

  const primary = 'var(--color-primary, #2563EB)';
  const secondary = 'var(--color-secondary, #F59E0B)';
  const surface = 'var(--color-surface, #ffffff)';
  const text = 'var(--color-text, #111827)';
  const border = 'var(--border-color, rgba(17,24,39,0.08))';

  // Determine value arc color based on ratio
  const ratio = safeVal / safeMax;
  const valueColor = ratio < 0.66 ? primary : secondary;

  return (
    <div className="panel" style={{ padding: 12, background: surface, border: `1px solid ${border}`, borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
      <div className="panel-title" style={{ marginBottom: 8 }}>{title}</div>
      <div className="chart-box" style={{ height }}>
        <div className="chart-grid-bg" />
        <svg viewBox={`0 0 ${chart.width} ${chart.vbHeight}`} width="100%" height="100%" role="img" aria-label={`${title} gauge`}>
          {/* subtle bands */}
          {chart.bands.map((b, idx) => (
            <path key={idx} d={b.d} fill="none" stroke={b.color} strokeWidth="16" />
          ))}

          {/* background arc */}
          <path d={chart.bgArc} fill="none" stroke="rgba(17,24,39,0.12)" strokeWidth="18" strokeLinecap="round" />

          {/* value arc */}
          <path d={chart.valArc} fill="none" stroke={valueColor} strokeWidth="18" strokeLinecap="round" />

          {/* ticks (simple 0, 50%, 100%) */}
          <g fill={text} fontSize="10" textAnchor="middle">
            <text x={30} y={245}>0</text>
            <text x={chart.width / 2} y={245}>{Math.round(safeMax * 0.5)}</text>
            <text x={chart.width - 30} y={245}>{safeMax}</text>
          </g>

          {/* needle */}
          <line x1={chart.cx} y1={chart.cy} x2={chart.nx} y2={chart.ny} stroke={text} strokeWidth="2.5" />
          <circle cx={chart.cx} cy={chart.cy} r="5" fill={text} />

          {/* center label */}
          <g>
            <text x={chart.cx} y={chart.cy - 18} fill={text} fontSize="14" textAnchor="middle" style={{ fontWeight: 700 }}>
              {safeVal.toLocaleString()}
            </text>
            {caption ? (
              <text x={chart.cx} y={chart.cy - 2} fill="rgba(17,24,39,0.65)" fontSize="12" textAnchor="middle">
                {caption}
              </text>
            ) : null}
          </g>
        </svg>
      </div>
    </div>
  );
}
