"use client"
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell, Search, User } from 'lucide-react';

export default function DashboardLayout({ 
  children, 
  activeTab, 
  setActiveTab 
}: { 
  children: React.ReactNode,
  activeTab: string,
  setActiveTab: (tab: string) => void
}) {

  return (
    <div className="min-h-screen bg-obsidian text-text-luxury flex font-inter">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        {/* Background Mesh Overlay */}
        <div className="absolute inset-0 mesh-bg -z-10 opacity-20"></div>

        {/* Topbar */}
        <header className="h-20 border-b border-border-glow bg-obsidian/40 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4 glass-obsidian border-amber-primary/10 px-5 py-2.5 rounded-2xl w-[28rem] focus-within:border-amber-primary/40 focus-within:amber-glow transition-all duration-500">
            <Search className="w-4 h-4 text-amber-primary opacity-60" />
            <input 
              type="text" 
              placeholder="Query intelligence nodes..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-text-dim/40 font-medium"
            />
          </div>

          <div className="flex items-center gap-8">
            <button className="relative p-2 text-text-dim hover:text-amber-primary transition-all duration-300 hover:scale-110 group">
              <Bell className="w-5 h-5 group-hover:amber-text-glow" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-primary rounded-full border-2 border-obsidian amber-glow animate-pulse"></span>
            </button>
            <div className="h-6 w-[1px] bg-border-glow"></div>
            <div className="flex items-center gap-4 pl-2 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-outfit font-bold text-text-luxury group-hover:text-amber-primary transition-colors">Enterprise Intelligence</p>
                <p className="text-[9px] text-amber-primary/60 uppercase tracking-[0.2em] font-black group-hover:opacity-100 transition-opacity">Neural Tier v1.4</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-obsidian-card border border-border-glow flex items-center justify-center text-amber-primary amber-glow transition-transform group-hover:scale-105 active:scale-95">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="p-10 flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
}
