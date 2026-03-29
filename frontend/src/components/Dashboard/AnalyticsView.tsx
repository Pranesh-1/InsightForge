"use client"
import React, { useState, useEffect } from 'react';
import DocumentGraph from './DocumentGraph';
import { motion } from 'framer-motion';
import { BarChart3, Share2, Network, Sparkles } from 'lucide-react';
import { getAnalytics } from '@/lib/api';

const AnalyticsView = ({ onProbeSelect }: { onProbeSelect: (query: string) => void }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-8 h-8 border-2 border-amber-primary/20 border-t-amber-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-3xl font-outfit font-bold text-text-luxury amber-text-glow">Knowledge <span className="text-amber-primary">Topology</span></h2>
        <p className="text-text-dim text-sm tracking-wide">Mapping the semantic neural-net between documented intelligence nodes.</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-obsidian p-2 rounded-[2.5rem] border-amber-primary/10 overflow-hidden min-h-[600px]"
        >
          <DocumentGraph />
        </motion.div>

        <div className="space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass-obsidian p-8 rounded-3xl border-amber-primary/10"
           >
              <h3 className="text-amber-primary font-outfit font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                 <Share2 className="w-4 h-4" /> Semantic Clusters
              </h3>
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-obsidian-soft border border-border-glow">
                    <p className="text-xs text-text-luxury font-bold">Vector Density</p>
                    <div className="flex items-end justify-between mt-1">
                        <span className="text-[10px] text-amber-primary font-black uppercase tracking-widest">{data?.density || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-bg-dark rounded-full mt-2 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${data?.density || 0}%` }}
                         className="h-full bg-amber-primary amber-glow" 
                       />
                    </div>
                 </div>
                 <div className="p-4 rounded-2xl bg-obsidian-soft border border-border-glow">
                    <p className="text-xs text-text-luxury font-bold">Cross-Reference Score</p>
                    <div className="flex items-end justify-between mt-1">
                        <span className="text-[10px] text-amber-primary font-black uppercase tracking-widest">{data?.overlap || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-bg-dark rounded-full mt-2 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${data?.overlap || 0}%` }}
                         className="h-full bg-amber-primary amber-glow" 
                       />
                    </div>
                 </div>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="glass-obsidian p-8 rounded-3xl border-amber-primary/10"
           >
              <h3 className="text-amber-primary font-outfit font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                 <Network className="w-4 h-4" /> Neural Insights
              </h3>
              <p className="text-xs text-text-dim leading-relaxed">
                 {data?.insight || "Awaiting intelligence nodes..."}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                 {(data?.tags || []).map((tag: any) => (
                   <span key={tag} className="px-3 py-1 bg-amber-primary/10 text-amber-primary text-[9px] font-bold uppercase rounded-full border border-amber-primary/20">{tag}</span>
                 ))}
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="glass-obsidian p-8 rounded-3xl border-amber-primary/10"
           >
              <h3 className="text-amber-primary font-outfit font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                 <Sparkles className="w-4 h-4" /> Suggested Probes
              </h3>
              <div className="space-y-3">
                 {(data?.probes || []).length > 0 ? (data.probes.map((query: string, i: number) => (
                   <button 
                     key={i}
                     onClick={() => onProbeSelect(query)}
                     className="w-full text-left p-4 rounded-xl bg-obsidian-soft border border-border-glow hover:border-amber-primary/30 hover:bg-amber-primary/5 transition-all text-[11px] text-text-dim hover:text-text-luxury group flex items-start gap-3"
                   >
                     <div className="mt-0.5 p-1 rounded-md bg-bg-dark border border-border-glow group-hover:border-amber-primary/20 transition-colors">
                        <BarChart3 className="w-3 h-3 text-amber-primary" />
                     </div>
                     {query}
                   </button>
                 ))) : (
                   <p className="text-[10px] text-text-dim italic">Upload documents to generate probes.</p>
                 )}
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
