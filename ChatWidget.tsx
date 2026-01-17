
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION, BLOG_URL } from '../constants';

interface GroundingLink {
  uri: string;
  title: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingLink[];
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Welcome! I'm your architectural guide for Nicholas's latest post. \n\nAre you interested in how we handle **Fleet Orchestration** at scale, or should we dive into the **Six Pillars** of building a modern data platform?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
            { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
          temperature: 0.3,
        }
      });

      const aiResponseText = response.text || "I couldn't generate a response. Please try rephrasing your question.";
      
      const sources: GroundingLink[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({
              uri: chunk.web.uri,
              title: chunk.web.title || chunk.web.uri
            });
          }
        });
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: aiResponseText,
        sources: sources.length > 0 ? sources : undefined
      }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "Connectivity lost. Please check your network and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] md:w-[420px] h-[600px] max-h-[80vh] mb-5 glass-panel rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border border-white/10 animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="bg-slate-900/90 p-5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                <i className="fas fa-layer-group text-cyan-400"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Data Platform Agent</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Trained on NicholasPacl.com</span>
                </div>
              </div>
            </div>
            <button onClick={onToggle} className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-transparent to-slate-950/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[88%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600 text-white rounded-br-none' 
                    : 'bg-slate-800/80 text-slate-200 rounded-bl-none border border-white/5'
                }`}>
                  <div className="markdown-content whitespace-pre-wrap">
                    {msg.text}
                  </div>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Architectural References</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(msg.sources.map(s => s.uri))).map((uri, sIdx) => {
                          const source = msg.sources?.find(s => s.uri === uri);
                          return (
                            <a 
                              key={sIdx} 
                              href={uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] bg-slate-900 hover:bg-black text-cyan-400 px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-all border border-white/5"
                            >
                              <i className="fas fa-external-link-alt text-[8px]"></i>
                              {source?.title.split('|')[0].trim().substring(0, 28)}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-slate-800/50 p-4 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Processing</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-5 bg-slate-900/40 border-t border-white/5">
            <div className="relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Ask about data orchestration..."
                className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none h-[54px]"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 w-10 h-10 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 group-focus-within:shadow-cyan-500/20"
              >
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button 
        onClick={onToggle}
        className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-90 ${
          isOpen ? 'bg-slate-800 rotate-180' : 'bg-gradient-to-tr from-cyan-600 to-cyan-400'
        }`}
      >
        <div className="relative">
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-terminal'} text-2xl transition-all duration-300`}></i>
          {!isOpen && (
             <span className="absolute -top-3 -right-3 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-cyan-500 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold">1</span>
             </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default ChatWidget;
