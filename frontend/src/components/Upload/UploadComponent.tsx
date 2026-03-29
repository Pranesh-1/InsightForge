"use client"
import React, { useState } from 'react';
import { Upload, File, Globe, Database, X, CheckCircle2, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ingestFile, clearSession } from '@/lib/api';

const UploadComponent = ({ 
  files, 
  setFiles 
}: { 
  files: any[], 
  setFiles: React.Dispatch<React.SetStateAction<any[]>> 
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const data = await ingestFile(file);
      setFiles(prev => [...prev, { 
        name: data.filename, 
        type: file.name.split('.').pop()?.toUpperCase() || 'Document', 
        status: 'completed',
        insights: data.insights
      }]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  const scrollToInsight = (name: string) => {
    const element = document.getElementById(`insight-${name}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('amber-glow-pulse');
        setTimeout(() => element.classList.remove('amber-glow-pulse'), 2000);
    }
  };

  const handleClearFiles = async () => {
    try {
      await clearSession();
      setFiles([]);
    } catch (error) {
      console.error("Failed to clear backend", error);
      setFiles([]);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-outfit font-bold text-text-luxury amber-text-glow">Data <span className="text-amber-primary">Intelligence</span></h2>
          <p className="text-xs text-text-dim mt-2 tracking-widest uppercase font-black opacity-50">Ingestion & Vectorization Matrix</p>
        </div>
        
        <button 
          onClick={handleClearFiles}
          className="flex items-center gap-3 px-6 py-3 bg-obsidian-card border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500/60 uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-400/40 transition-all hover:scale-105 group"
        >
          <Trash2 className="w-4 h-4" />
          Purge Neural Repository
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: File, label: 'Upload PDF', desc: 'Secure document analysis', color: 'text-blue-400' },
          { icon: Database, label: 'Connect CSV', desc: 'Large dataset intelligence', color: 'text-green-400' },
          { icon: Globe, label: 'Add Website', desc: 'Real-time web crawling', color: 'text-purple-400' },
        ].map((item, idx) => (
          <button 
            key={idx}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleUpload(file);
              };
              input.click();
            }}
            className="group p-8 glass-obsidian rounded-[2rem] border-amber-primary/10 hover:border-amber-primary/40 transition-all duration-500 text-left relative overflow-hidden flex flex-col items-start"
          >
            <div className={`p-4 rounded-2xl bg-obsidian-card border border-border-glow group-hover:border-amber-primary/40 transition-colors w-fit mb-6`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <h3 className="text-xl font-outfit font-bold text-text-luxury mb-2 group-hover:text-amber-primary transition-colors">{item.label}</h3>
            <p className="text-xs text-text-dim leading-relaxed">{item.desc}</p>
            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
               <Upload className="w-5 h-5 text-amber-primary" />
            </div>
          </button>
        ))}
      </div>

      <div className="glass-obsidian rounded-3xl border-amber-primary/10 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-border-glow flex items-center justify-between bg-obsidian-card/50">
          <h2 className="text-xl font-outfit font-bold text-text-luxury amber-text-glow">Management <span className="text-amber-primary">Console</span></h2>
          <span className="text-[10px] text-amber-primary uppercase tracking-[0.3em] font-black bg-amber-primary/10 px-4 py-1.5 rounded-full border border-amber-primary/20">
            {files.length} ACTIVE NODES
          </span>
        </div>

        <div className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-dark/20 text-[10px] text-text-dim uppercase tracking-[0.2em] font-bold border-b border-border-glow">
                <th className="px-8 py-5 font-bold">Intelligence Source</th>
                <th className="px-8 py-5 font-bold">Node Type</th>
                <th className="px-8 py-5 font-bold">State</th>
                <th className="px-8 py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glow">
              <AnimatePresence>
                {files.map((file, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={file.name} 
                    onClick={() => scrollToInsight(file.name)}
                    className="hover:bg-amber-primary/5 transition-all duration-300 group cursor-pointer"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-obsidian-card border border-border-glow group-hover:border-amber-primary/40 transition-colors">
                            <File className="w-4 h-4 text-amber-primary" />
                        </div>
                        <span className="text-sm font-medium text-text-luxury group-hover:text-amber-primary transition-colors">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim px-3 py-1 bg-obsidian-card rounded-md border border-border-glow">{file.type}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                        NEURAL INDEXED
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file.name);
                        }}
                        className="p-2.5 bg-obsidian-card border border-border-glow text-text-dim hover:text-red-400 hover:border-red-400/30 transition-all rounded-xl hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {files.length === 0 && !isUploading && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-text-muted italic text-sm">
                    No data sources connected yet. Upload your first document to begin.
                  </td>
                </tr>
              )}
              {isUploading && (
                <tr className="animate-pulse bg-gold-primary/5">
                  <td colSpan={4} className="px-6 py-8">
                     <div className="flex items-center justify-center gap-3 text-gold-light text-sm">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing intelligence pipeline...
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {files.some(f => f.insights) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pb-10">
           {files.filter(f => f.insights).map((file, i) => (
             <div 
               key={i} 
               id={`insight-${file.name}`}
               className="p-8 glass-obsidian border-amber-primary/10 rounded-[2rem] relative overflow-hidden group transition-all duration-500 hover:border-amber-primary/30"
             >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-20 h-20 text-amber-primary" />
                </div>
                <h3 className="text-amber-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-amber-primary/10 border border-amber-primary/20">
                      <Sparkles className="w-4 h-4" />
                   </div>
                   AI Neural Insights: {file.name}
                </h3>
                <div className="text-xs md:text-sm text-text-dim whitespace-pre-wrap leading-relaxed font-medium">
                   {file.insights}
                </div>
                <div className="mt-8 pt-6 border-t border-border-glow flex items-center gap-2 text-[10px] text-amber-primary font-bold uppercase tracking-widest opacity-60">
                   <CheckCircle2 className="w-3.5 h-3.5" /> Contextualized Retrieval Ready
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
