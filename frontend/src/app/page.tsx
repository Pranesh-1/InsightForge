"use client"
import React, { useState } from 'react';
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
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Neural engines synchronized. I am InsightForge. Feed me data for deep intelligence synthesis." }
  ]);
  const [chatQuery, setChatQuery] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
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
        return <AnalyticsView onProbeSelect={(query) => {
          setChatQuery(query);
          setActiveTab('chat');
        }} />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-text-primary capitalize">
          {activeTab} <span className="text-gold-light italic">Intelligence</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">
          InsightForge Multi-Agent RAG Orchestrator v1.0.4
        </p>
      </div>
      
      {renderContent()}
    </DashboardLayout>
  );
}
