"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Paperclip, ChevronRight, Info, ExternalLink, Trash2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { queryRAG, ingestFile } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  insights?: string;
  citations?: { idx: number; source: string; page: number }[];
  cost?: number;
}

const ChatInterface = ({ 
  messages, 
  setMessages,
  injectedQuery,
  onQueryConsumed
}: { 
  messages: Message[], 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  injectedQuery?: string | null,
  onQueryConsumed?: () => void
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-trigger injected query
  useEffect(() => {
    if (injectedQuery && !isLoading) {
      setInput(injectedQuery);
      // We use a small timeout to ensure state is settled
      const timer = setTimeout(() => {
        handleSend(injectedQuery);
        if (onQueryConsumed) onQueryConsumed();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [injectedQuery]);

  const handleClearChat = () => {
    setMessages([{ 
      role: 'assistant', 
      content: "Neural buffer cleared. Memory reset. Ready for new instructions." 
    }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    try {
      const data = await ingestFile(file);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Successfully uploaded and indexed ${data.filename}! I've extracted ${data.chunks} segments and generated initial insights. How would you like me to analyze it?`,
        insights: data.insights
      }]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (directQuery?: string | React.MouseEvent) => {
    const queryText = typeof directQuery === 'string' ? directQuery : input;
    if (!queryText || !queryText.trim()) return;
    
    const userMsg: Message = { role: 'user', content: queryText };
    setMessages(prev => [...prev, userMsg]);
    if (!directQuery) setInput('');
    setIsLoading(true);

    try {
      const data = await queryRAG(queryText);
      const assistantMsg: Message = { 
        role: 'assistant', 
        content: data.answer,
        citations: (data.source_chunks || []).map((c: any, i: number) => ({
          idx: i + 1,
          source: c.metadata?.document_name || "Context",
          page: c.metadata?.page_number
        })),
        cost: data.cost?.total_cost || 0
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Query failed", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error while processing your request." } as Message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-5xl mx-auto glass-obsidian rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative border-amber-primary/10">
      {/* Background Mesh for depth */}
      <div className="absolute inset-0 mesh-bg -z-10 opacity-30"></div>
      
      {/* Chat Header */}
      <div className="flex items-center justify-between p-8 border-b border-border-glow bg-obsidian-card/40">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-primary/10 border border-amber-primary/20 rounded-2xl amber-glow">
            <MessageSquare className="w-5 h-5 text-amber-primary" />
          </div>
          <div>
            <h2 className="text-xl font-outfit font-bold text-text-luxury amber-text-glow">Neural <span className="text-amber-primary">Interrogation</span></h2>
            <p className="text-[10px] text-text-dim uppercase tracking-[0.2em] font-black opacity-50">Multi-Agent Consensus Mode</p>
          </div>
        </div>
        
        <button 
          onClick={handleClearChat}
          className="flex items-center gap-3 px-5 py-2.5 bg-obsidian-card border border-border-glow rounded-xl text-[10px] font-black text-text-dim uppercase tracking-widest hover:text-red-400 hover:border-red-400/30 transition-all hover:scale-105 group"
        >
          <Trash2 className="w-4 h-4 group-hover:animate-bounce" />
          Clear Brain Buffer
        </button>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={idx}
              className={cn(
                "flex gap-5 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-transform hover:scale-110",
                msg.role === 'user' ? "bg-amber-dim border-amber-primary/30 text-amber-primary amber-glow" : "bg-obsidian-card border-border-glow text-text-dim"
              )}>
                {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              
              <div className={cn("space-y-4", msg.role === 'user' ? "text-right" : "text-left")}>
                <div className={cn(
                  "p-5 rounded-2xl text-[15px] leading-relaxed shadow-lg transition-all",
                  msg.role === 'user' 
                    ? "bg-gradient-to-br from-amber-primary to-amber-secondary text-obsidian font-semibold" 
                    : "glass-obsidian border border-amber-primary/10 text-text-luxury"
                )}>
                  {msg.content}
                </div>
                
                {msg.role === 'assistant' && (
                  <div className="flex flex-wrap gap-2">
                    <div className="text-[10px] text-text-dim uppercase tracking-[0.2em] flex items-center gap-2 mb-1 w-full font-bold">
                      <div className="w-2 h-2 rounded-full bg-amber-primary animate-pulse"></div>
                      Intelligence Sources
                    </div>
                    {msg.citations && msg.citations.map((cite: any, cIdx: number) => (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={cIdx} 
                        className="flex items-center gap-2 px-4 py-2 bg-obsidian-card border border-amber-primary/20 rounded-xl text-[12px] text-amber-primary hover:bg-amber-dim hover:border-amber-primary/40 transition-all group amber-glow"
                      >
                        <span className="font-bold opacity-70">[{cite.idx}]</span>
                        <span className="font-medium">{cite.source} (P{cite.page})</span>
                        <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 mr-auto"
            >
               <div className="w-11 h-11 rounded-2xl bg-obsidian-card border border-border-glow flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 text-amber-primary animate-pulse" />
               </div>
               <div className="flex items-center gap-1 p-5 rounded-2xl glass-obsidian border border-amber-primary/10">
                  <span className="w-1.5 h-1.5 bg-amber-primary rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-8 bg-black/40 backdrop-blur-md border-t border-border-glow">
        <div className="flex items-center gap-4 glass-obsidian p-3 rounded-2xl focus-within:border-amber-primary/40 focus-within:amber-glow transition-all duration-500">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".pdf,.csv"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-text-dim hover:text-amber-primary transition-all hover:scale-110"
          >
            <Paperclip className="w-6 h-6" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Interrogate your knowledge pool..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] py-2 placeholder:text-text-dim/40"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-4 bg-amber-primary rounded-xl text-obsidian hover:bg-amber-secondary transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale amber-glow shadow-[0_0_15px_rgba(255,191,0,0.3)]"
          >
            <Send className="w-6 h-6 fill-current" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-5">
           <p className="text-[10px] text-text-dim uppercase tracking-[0.3em] font-outfit font-bold opacity-60">
             Neural Engine Active · Zero Latency Protocol
           </p>
           <p className="text-[11px] font-outfit text-text-dim flex items-center gap-2">
             Interaction Cost: <span className="text-amber-primary font-bold amber-text-glow">${messages.length > 0 && messages[messages.length-1]?.cost !== undefined ? messages[messages.length-1]?.cost?.toFixed(4) : "0.0000"}</span>
           </p>
        </div>
      </div>
    </div>

  );
};

export default ChatInterface;
