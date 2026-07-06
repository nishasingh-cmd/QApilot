import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function SeverityChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0];
      return (
        <div className="bg-[#0b0e14]/95 border border-white/[0.08] rounded-xl p-2.5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.payload.color }} />
            <span>{p.name}:</span>
            <span className="font-mono">{p.value} findings</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -30, bottom: 5 }}>
          <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#ffffff30"
            fontSize={10}
            fontFamily="monospace"
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            stroke="#ffffff30"
            fontSize={10}
            fontFamily="monospace"
            tickLine={false}
            axisLine={false}
            tickCount={5}
            dx={-5}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} stroke={entry.color} strokeWidth={1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export default SeverityChart;
