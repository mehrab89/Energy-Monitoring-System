export default function StatCard({ title, value, unit, icon: Icon, trend, trendValue, color = "indigo" }) {
  const colorMap = {
    indigo: "from-indigo-500 to-purple-500",
    green: "from-emerald-500 to-teal-500",
    rose: "from-rose-500 to-orange-500",
    amber: "from-amber-500 to-yellow-500"
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorMap[color]} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-rose-400' : 'text-emerald-400'}`}>
            <span>{trend === 'up' ? '▲' : '▼'}</span>
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
          <span className="text-slate-400 font-medium">{unit}</span>
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
          <p className="text-xs text-slate-500 font-medium">
            {trend === 'up' ? 'Higher' : 'Lower'} than previous period
          </p>
        </div>
      )}
    </div>
  );
}
