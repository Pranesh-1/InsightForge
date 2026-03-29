"use client"
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, Coins, Target, TrendingUp, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStats } from '@/lib/api';
import { cn } from '@/lib/utils';

const data = [
  { name: 'Shift 1', value: 400 },
  { name: 'Shift 2', value: 600 },
  { name: 'Shift 3', value: 800 },
  { name: 'Shift 4', value: 500 },
  { name: 'Shift 5', value: 900 },
  { name: 'Shift 6', value: 750 },
];

const DashboardView = () => {
  const [liveStats, setLiveStats] = React.useState<any>(null);

  React.useEffect(() => {
    getStats().then(setLiveStats);
    const interval = setInterval(() => {
        getStats().then(setLiveStats);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Intelligence Depth', value: liveStats?.depth || '0 KB', icon: Activity, delta: '+12%', color: 'text-amber-primary' },
    { label: 'Retrieval Latency', value: liveStats?.retrieval_time || '0ms', icon: Zap, delta: '-4.2ms', color: 'text-amber-primary' },
    { label: 'Session Economy', value: liveStats?.total_cost || '$0.00', icon: Coins, delta: '+$0.02', color: 'text-amber-primary' },
    { label: 'Reasoning Precision', value: liveStats?.precision || '0%', icon: Target, delta: '+0.5%', color: 'text-amber-primary' },
  ];

  return (
    <div className="space-y-10 pb-10">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-3xl font-outfit font-bold text-text-luxury amber-text-glow">System <span className="text-amber-primary">Intelligence</span> Overview</h2>
        <p className="text-text-dim text-sm tracking-wide">Real-time heuristics and orchestration metrics from the multi-agent hive.</p>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-obsidian p-6 rounded-3xl border-amber-primary/10 relative overflow-hidden group cursor-default transition-all duration-500 hover:border-amber-primary/30 active:scale-95"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-amber-primary/10 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-3 rounded-2xl bg-obsidian-card border border-border-glow group-hover:border-amber-primary/40 group-hover:amber-glow transition-all duration-500`}>
                <stat.icon className={`w-6 h-6 text-amber-primary`} />
              </div>
              <div className={cn(
                "px-2 py-1 rounded-lg text-[9px] font-black tracking-tighter uppercase",
                stat.delta.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              )}>
                {stat.delta}
              </div>
            </div>
            
            <p className="text-text-dim text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">{stat.label}</p>
            <h3 className="text-3xl font-outfit font-bold text-text-luxury mt-2 tracking-tight group-hover:amber-text-glow transition-all">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Retrieval Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-obsidian p-10 rounded-[2.5rem] border-amber-primary/10 hover:border-amber-primary/20 transition-all duration-700"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-outfit font-bold text-text-luxury flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-amber-primary" />
              Retrieval <span className="text-amber-primary font-light italic">Heuristics</span>
            </h3>
            <select className="bg-obsidian-card border border-border-glow text-[10px] text-text-dim font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full outline-none focus:border-amber-primary/50 cursor-pointer hover:bg-obsidian-soft transition-all">
                <option>Active Session</option>
                <option>Historical Log</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFBF00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FFBF00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" stroke="#1A1A1A" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.9)', border: '1px solid rgba(255, 191, 0, 0.2)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#FFBF00', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#FFBF00" fillOpacity={1} fill="url(#colorAmber)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* System Load / Agents Status */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-obsidian p-10 rounded-[2.5rem] border-amber-primary/10 hover:border-amber-primary/20 transition-all duration-700"
        >
            <h3 className="text-xl font-outfit font-bold text-text-luxury mb-10 flex items-center gap-3">
              <Cpu className="w-6 h-6 text-amber-primary" />
              Agent Core <span className="text-amber-primary font-light italic">Saturation</span>
            </h3>
            <div className="space-y-8">
               {[
                 { name: 'Query Rewriter', status: 'Optimal', load: 12, color: 'bg-green-400' },
                 { name: 'Query Planner', status: 'Processing', load: 45, color: 'bg-amber-primary' },
                 { name: 'Retrieval Engine', status: 'Optimal', load: 28, color: 'bg-green-400' },
                 { name: 'Reranker Agent', status: 'Optimal', load: 31, color: 'bg-green-400' },
                 { name: 'Reasoning Engine', status: 'High Load', load: 88, color: 'bg-red-500' },
               ].map((agent, i) => (
                 <div key={i} className="space-y-3 group">
                    <div className="flex justify-between items-center">
                        <span className="text-text-luxury font-medium tracking-tight group-hover:text-amber-primary transition-colors">{agent.name}</span>
                        <span className="text-text-dim uppercase tracking-[0.2em] text-[9px] font-black opacity-50">{agent.status}</span>
                    </div>
                    <div className="h-2 w-full bg-obsidian-card rounded-full overflow-hidden border border-border-glow p-[2px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${agent.load}%` }}
                          transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                          className={`h-full rounded-full ${agent.color} shadow-[0_0_10px_rgba(255,191,0,0.3)] animate-pulse shadow-glow`}
                        />
                    </div>
                 </div>
               ))}
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardView;
