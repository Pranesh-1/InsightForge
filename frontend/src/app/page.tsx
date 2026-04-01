"use client"
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChatInterface from '@/components/Chat/ChatInterface';
import UploadComponent from '@/components/Upload/UploadComponent';
import DashboardView from '@/components/Dashboard/DashboardView';
import AnalyticsView from '@/components/Dashboard/AnalyticsView';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  insights?: string;
  citations?: { idx: number; source: string; page: number }[];
  cost?: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [files, setFiles] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Neural engines synchronized. I am InsightForge. Feed me data for deep intelligence synthesis." }
  ]);
  const [chatQuery, setChatQuery] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, a] = await Promise.all([
          import('@/lib/api').then(m => m.getStats()),
          import('@/lib/api').then(m => m.getAnalytics())
        ]);
        setStats(s);
        setAnalytics(a);
      } catch (e) {
        console.error("Telemetry sync failed", e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Reset scroll to top whenever the active tab changes
  useEffect(() => {
    const el = document.getElementById('main-scroll');
    if (el) el.scrollTop = 0;
  }, [activeTab]);
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView liveStats={stats} />;
      case 'chat':
        return <ChatInterface 
          messages={messages} 
          setMessages={setMessages} 
          injectedQuery={chatQuery}
          onQueryConsumed={() => setChatQuery(null)}
        />;
      case 'upload':
        return <UploadComponent files={files} setFiles={setFiles} />;
      case 'analytics':
        return <AnalyticsView 
          data={analytics}
          onProbeSelect={(query) => {
            setChatQuery(query);
            setActiveTab('chat');
          }} 
        />;
      default:
        return <DashboardView liveStats={stats} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
