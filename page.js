'use client';
import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import UsageChart from '@/components/UsageChart';
import { Zap, DollarSign, Activity, ListChecks } from 'lucide-react';

export default function Dashboard() {
  const [liveData, setLiveData] = useState({
    kw: '0.00',
    timestamp: new Date().toISOString(),
    activeCount: 0,
    activeNames: [],
    todayCost: '0.00',
    monthlySpent: '0.00',
    monthlyBudget: '100.00',
    budgetProgress: '0.0'
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Initial fetch
    fetchStatus();

    // Polling every 1 second instead of 3 for live variability
    const interval = setInterval(fetchStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (!data.error) {
        setLiveData(data);
        
        // Update chart history
        const newPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          usage: parseFloat(data.kw)
        };
        
        setHistory(prev => {
          const updated = [...prev, newPoint];
          if (updated.length > 20) return updated.slice(1);
          return updated;
        });
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight text-white">Overview</h2>
        <p className="text-slate-400">Real-time energy tracking dashboard</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Live Energy Usage" 
          value={liveData.kw} 
          unit="kW" 
          icon={Zap} 
          color="indigo"
        />
        <StatCard 
          title="Today's Cost" 
          value={`$${liveData.todayCost}`} 
          unit="" 
          icon={DollarSign} 
          color="green"
        />
        <StatCard 
          title="Active Appliances" 
          value={liveData.activeCount} 
          unit="Running" 
          icon={Activity} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Consumption Trend</h3>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-medium">Today</button>
              <button className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 text-sm font-medium hover:text-white transition-colors">Week</button>
              <button className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 text-sm font-medium hover:text-white transition-colors">Month</button>
            </div>
          </div>
          <UsageChart data={history} />
        </div>

        {/* Active Appliances List */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6">Active Appliances</h3>
          <div className="space-y-4">
            {liveData.activeNames.length > 0 ? (
              liveData.activeNames.map((name, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{name}</p>
                      <p className="text-xs text-slate-500">Currently drawing power</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                  <Activity size={32} />
                </div>
                <p className="text-slate-500 font-medium">No appliances currently drawing power within their schedule.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Monthly Progress */}
      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Monthly Budget Status</h3>
            <p className="text-sm text-slate-400">Targeting to stay below ${liveData.monthlyBudget || '100.00'} this month</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-sm font-medium">Spent: </span>
            <span className="text-white font-bold">${liveData.monthlySpent || '0.00'}</span>
            <span className="text-slate-500 text-sm ml-2">/ ${liveData.monthlyBudget || '100.00'}</span>
          </div>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1.5px]">
          <div 
            className={`h-full bg-gradient-to-r rounded-full shadow-lg transition-all duration-1000 ${
              parseFloat(liveData.budgetProgress) > 90 
                ? 'from-rose-500 to-red-600 shadow-rose-500/50' 
                : parseFloat(liveData.budgetProgress) > 70
                ? 'from-amber-500 to-orange-600 shadow-amber-500/50'
                : 'from-indigo-500 via-purple-500 to-indigo-500 shadow-indigo-500/50'
            }`} 
            style={{ width: `${liveData.budgetProgress || 0}%` }}
          />
        </div>
        <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span className={parseFloat(liveData.budgetProgress) > 90 ? 'text-rose-400 opacity-100' : 'opacity-40'}>Critical</span>
            <span className={parseFloat(liveData.budgetProgress) > 70 && parseFloat(liveData.budgetProgress) <= 90 ? 'text-amber-400 opacity-100' : 'opacity-40'}>Warning</span>
            <span className={parseFloat(liveData.budgetProgress) <= 70 ? 'text-emerald-400 opacity-100' : 'opacity-40'}>Safe</span>
        </div>
      </div>
    </div>
  );
}
