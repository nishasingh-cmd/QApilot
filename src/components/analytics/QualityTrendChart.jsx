import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const METRIC_DEFS = [
  { id: 'Quality Score',   color: '#4F8CFF', name: 'Quality Score' },
  { id: 'Code Coverage',   color: '#4FD1FF', name: 'Code Coverage' },
  { id: 'Test Coverage',   color: '#10b981', name: 'Test Coverage' },
  { id: 'Maintainability', color: '#a855f7', name: 'Maintainability' },
];

export function QualityTrendChart({ data }) {
  const [activeMetrics, setActiveMetrics] = useState({
    'Quality Score': true,
    'Code Coverage': true,
    'Test Coverage': true,
    'Maintainability': true,
  });

  const toggleMetric = (metricId) => {
    setActiveMetrics((prev) => ({
      ...prev,
      [metricId]: !prev[metricId],
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b0e14]/95 border border-white/[0.08] rounded-xl p-3.5 shadow-2xl backdrop-blur-xl">
          <p className="text-xs font-bold text-white mb-2 font-mono">{label}</p>
          <div className="space-y-1.5">
            {payload.map((p) => (
              <div key={p.name} className="flex items-center justify-between gap-6 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.stroke }} />
                  <span className="text-brand-text-secondary font-medium">{p.name}</span>
                </div>
                <span className="font-bold text-white font-mono">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Selector pills */}
      <div className="flex flex-wrap gap-2">
        {METRIC_DEFS.map((m) => {
          const isActive = activeMetrics[m.id];
          return (
            <button
              key={m.id}
              onClick={() => toggleMetric(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white/[0.04] text-white border-white/[0.12]'
                  : 'bg-transparent text-brand-text-secondary/50 border-white/[0.04] hover:text-brand-text-secondary'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: isActive ? m.color : '#ffffff10', transition: 'background-color 0.2s' }}
              />
              {m.name}
            </button>
          );
        })}
      </div>

      {/* Chart container */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#ffffff30"
              fontSize={10}
              fontFamily="monospace"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#ffffff30"
              fontSize={10}
              fontFamily="monospace"
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickCount={6}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255, 255, 255, 0.06)' }} />
            {METRIC_DEFS.map((m) => {
              if (!activeMetrics[m.id]) return null;
              return (
                <Line
                  key={m.id}
                  type="monotone"
                  dataKey={m.id}
                  stroke={m.color}
                  strokeWidth={2.5}
                  dot={{ r: 0 }}
                  activeDot={{ r: 4, strokeWidth: 1.5, stroke: '#07090F' }}
                  animationDuration={800}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default QualityTrendChart;
