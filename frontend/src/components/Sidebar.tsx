"use client"
import React from 'react';
import { LayoutDashboard, MessageSquare, Upload, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'upload', icon: Upload, label: 'Data Sources' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Support' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-obsidian-card border-r border-border-glow flex flex-col z-50">
      <div className="h-20 flex items-center justify-center border-b border-border-glow/40 bg-obsidian-soft/30">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-outfit text-amber-primary tracking-[0.25em] font-black amber-text-glow leading-none"
        >
          INSIGHT<span className="text-text-luxury font-light opacity-80">FORGE</span>
        </motion.h1>
      </div>

      <nav className="flex-1 px-4 space-y-3">
        {menuItems.map((item, idx) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
              activeTab === item.id 
                ? "bg-amber-dim text-amber-primary border border-amber-primary/30 amber-glow" 
                : "text-text-dim hover:bg-obsidian-soft hover:text-text-luxury"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-amber-primary rounded-r-full"
              />
            )}
            <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeTab === item.id ? "text-amber-primary" : "group-hover:text-amber-primary")} />
            <span className="text-xs font-semibold tracking-widest uppercase">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="p-4 border-t border-border-glow space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-4 px-4 py-3 text-text-dim hover:text-amber-primary transition-colors group"
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold tracking-widest uppercase">{item.label}</span>
          </button>
        ))}
        <button className="w-full flex items-center gap-4 px-4 py-3 text-red-500/50 hover:text-red-500 transition-colors mt-4 group">
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold tracking-widest uppercase">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
