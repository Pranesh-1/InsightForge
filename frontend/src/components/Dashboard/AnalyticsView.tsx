"use client"
import React from 'react';
import DocumentGraph from './DocumentGraph';
import { motion } from 'framer-motion';
import { BarChart3, Share2, Network, Sparkles, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AnalyticsView = ({ onProbeSelect, data }: { onProbeSelect: (query: string) => void, data: any }) => {
  const loading = !data;

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
        {/* Sticky Topology Graph */}
        <div className="lg:col-span-2 glass-obsidian p-2 rounded-[2.5rem] border-amber-primary/10 overflow-hidden h-[calc(100vh-160px)] lg:sticky lg:top-10 cursor-default bg-bg-dark/10">
          <DocumentGraph />
        </div>

        <div className="space-y-8 pb-20">
           {/* Semantic Metrics */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass-obsidian p-8 rounded-3xl border-amber-primary/10 bg-gradient-to-br from-obsidian-card to-bg-dark/40 hover:border-amber-primary/30 transition-all duration-500"
           >
              <h3 className="text-amber-primary font-outfit font-bold uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                 <Share2 className="w-4 h-4" /> Topological Heuristics
              </h3>
              <div className="space-y-6">
                 <div className="p-5 rounded-2xl bg-obsidian-soft border border-border-glow group hover:bg-amber-primary/5 transition-all">
                    <p className="text-[10px] text-text-dim uppercase tracking-widest mb-2 flex justify-between items-center font-bold">
                       <span>Neural Convergence</span>
                       <span className="text-amber-primary font-black">{data?.density || 0}%</span>
                    </p>
                    <div className="h-1.5 w-full bg-bg-dark rounded-full overflow-hidden p-[1px]">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${data?.density || 0}%` }}
                         className="h-full bg-amber-primary shadow-glow rounded-full" 
                       />
                    </div>
                 </div>
                 <div className="p-5 rounded-2xl bg-obsidian-soft border border-border-glow group hover:bg-amber-primary/5 transition-all">
                    <p className="text-[10px] text-text-dim uppercase tracking-widest mb-2 flex justify-between items-center font-bold">
                       <span>Node Connectivity</span>
                       <span className="text-amber-primary font-black">{data?.overlap || 0}%</span>
                    </p>
                    <div className="h-1.5 w-full bg-bg-dark rounded-full overflow-hidden p-[1px]">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${data?.overlap || 0}%` }}
                         className="h-full bg-amber-primary shadow-glow rounded-full" 
                       />
                    </div>
                 </div>
                 <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1 p-4 rounded-2xl bg-obsidian-card border border-border-glow flex flex-col items-center hover:bg-amber-primary/5 transition-colors group">
                        <Activity className="w-4 h-4 text-amber-primary mb-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[10px] text-text-dim uppercase tracking-tighter font-bold">Complexity</span>
                        <span className="text-lg font-outfit font-bold text-text-luxury">{data?.complexity || 0}</span>
                    </div>
                    <div className="flex-1 p-4 rounded-2xl bg-obsidian-card border border-border-glow flex flex-col items-center hover:bg-amber-primary/5 transition-colors group">
                        <Network className="w-4 h-4 text-amber-primary mb-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[10px] text-text-dim uppercase tracking-tighter font-bold">Latent Ties</span>
                        <span className="text-lg font-outfit font-bold text-text-luxury">{Math.floor((data?.overlap || 0) / 10)}</span>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Professional Insight List */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="glass-obsidian p-8 rounded-3xl border-amber-primary/10 hover:border-amber-primary/30 transition-all duration-500"
           >
              <h3 className="text-amber-primary font-outfit font-bold uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                 <Activity className="w-4 h-4" /> Neural Intelligence List
              </h3>
              <div className="space-y-6">
                 {(data?.insights || []).length > 0 ? (data.insights.map((insight: string, i: number) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 + 0.2 }}
                     key={i} 
                     className="flex items-start gap-4 group"
                   >
                     <div className="mt-1.5 w-1.5 h-1.5 rounded-sm bg-amber-primary rotate-45 group-hover:scale-150 transition-transform shadow-glow" />
                     <div className="text-[11px] text-text-luxury leading-relaxed font-outfit opacity-90 group-hover:opacity-100 transition-opacity prose prose-invert prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{insight}</ReactMarkdown>
                     </div>
                   </motion.div>
                 ))) : (
                    <p className="text-[10px] text-text-dim italic opacity-50">Upload document nodes to initiate intelligence mapping.</p>
                 )}
              </div>
              <div className="mt-10 flex flex-wrap gap-2 overflow-x-hidden">
                 {(data?.tags || []).map((tag: any) => (
                   <span key={tag} className="px-3 py-1 bg-amber-primary/10 text-amber-primary text-[9px] font-black uppercase rounded-full border border-amber-primary/20 tracking-wider transition-all hover:bg-amber-primary hover:text-bg-dark mb-1">{tag}</span>
                 ))}
              </div>
           </motion.div>

           {/* Inquiry Probes */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="glass-obsidian p-8 rounded-3xl border-amber-primary/10 hover:border-amber-primary/30 transition-all duration-500"
           >
              <h3 className="text-amber-primary font-outfit font-bold uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                 <Sparkles className="w-4 h-4" /> Neural Inquiry Probes
              </h3>
              <div className="flex flex-col gap-4">
                 {(data?.probes || []).map((probe: any, i: number) => {
                    const sourceText = typeof probe === 'string' ? "Discovery Node" : probe.source;
                    const questionText = typeof probe === 'string' ? probe : probe.text;
                    
                    return (
                      <motion.button 
                        key={i}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onProbeSelect(questionText)}
                        className="w-full text-left p-4 rounded-2xl bg-obsidian-soft border border-border-glow hover:border-amber-primary/30 hover:bg-amber-primary/5 transition-all text-sm font-medium text-text-dim hover:text-text-luxury group flex flex-col items-start gap-3 shadow-sm hover:shadow-amber-primary/10"
                      >
                        <div className="flex items-center gap-2.5 w-full">
                           <div className="p-1.5 rounded-lg bg-bg-dark border border-border-glow group-hover:border-amber-primary/20 transition-colors">
                               <BarChart3 className="w-3 h-3 text-amber-primary" />
                           </div>
                           <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-primary/40 group-hover:text-amber-primary transition-colors">
                              DOC: {sourceText === "Discovery Node" && data?.tags?.[0] ? data.tags[0].toUpperCase() : sourceText.toUpperCase()}
                           </span>
                        </div>
                        <span className="text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity font-medium">
                           {questionText}
                        </span>
                      </motion.button>
                    );
                 })}
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
