import React, { useRef, useEffect, useState } from 'react';
import { Send, Terminal as TerminalIcon } from 'lucide-react';
import { ChatMessage, SystemConfig } from '../types';
import ReactMarkdown from 'react-markdown';

interface TerminalProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  systemConfig: SystemConfig;
}

const Terminal: React.FC<TerminalProps> = ({ messages, onSendMessage, isProcessing, systemConfig }) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black/40 rounded-sm border border-white/5 overflow-hidden relative">
      <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 justify-between backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <TerminalIcon className="w-3 h-3 text-neon-blue" />
          <span>CMD_EXEC // {systemConfig.model}</span>
        </div>
        <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 font-mono text-sm">
        {messages.length === 0 && (
          <div className="text-gray-600 text-center mt-20 opacity-50">
            <p>HacheDev Terminal v2.5.0</p>
            <p>System Ready. Waiting for input...</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-white/10 border-white/10' : 'bg-transparent border-l-2 border-neon-blue pl-4'} rounded-sm p-3`}>
              {msg.role === 'user' ? (
                <div className="text-white">{msg.text}</div>
              ) : (
                <div className="prose prose-invert prose-sm prose-p:text-gray-300 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-code:text-neon-blue">
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-600 mt-1 uppercase">
              {msg.role === 'user' ? 'OP_USER' : 'AI_CORE'} // {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex flex-col items-start">
            <div className="bg-transparent border-l-2 border-hache-green pl-4 p-3 animate-pulse">
               <span className="text-hache-green text-xs tracking-widest">PROCESSING_LOGIC_MATRIX...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-md">
        <div className="relative flex items-center">
            <span className="absolute left-3 text-neon-blue font-mono text-lg">{'>'}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="w-full bg-black/60 border border-white/10 text-white font-mono text-sm pl-8 pr-12 py-3 focus:outline-none focus:border-neon-blue/50 transition-colors shadow-inner"
              placeholder="Execute command or query..."
              autoFocus
            />
            <button 
                onClick={handleSubmit}
                disabled={!input.trim() || isProcessing}
                className="absolute right-2 p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
