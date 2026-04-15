'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 bg-[#0a0a1a] shadow-2xl border-indigo-500/30">
        <p className="text-slate-400 text-xs font-semibold uppercase mb-1">{label}</p>
        <p className="text-white text-lg font-bold">
          {payload[0].value} <span className="text-sm font-medium text-slate-400 font-sans">kWh</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function UsageChart({ data }) {
  // Fallback data if none provided
  const chartData = data || [
    { time: '00:00', usage: 0.8 },
    { time: '04:00', usage: 0.4 },
    { time: '08:00', usage: 1.2 },
    { time: '12:00', usage: 3.1 },
    { time: '16:00', usage: 2.8 },
    { time: '20:00', usage: 1.5 },
    { time: '23:59', usage: 0.9 },
  ];

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="usage" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorUsage)" 
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
