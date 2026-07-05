import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

interface LoginProps {
  onUnlock: () => void;
}

const Login: React.FC<LoginProps> = ({ onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [bootSequence, setBootSequence] = useState<string[]>([]);
  
  useEffect(() => {
    const seq = [
      "Initializing HacheDev Kernel...",
      "Loading Neural Bridges...",
      "Verifying BIP39 Signatures...",
      "Connecting to PMD Origin...",
      "System Ready. Awaiting Key."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < seq.length) {
        setBootSequence(prev => [...prev, seq[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = input.trim();
    const validKeys = ["4DH4CH3D3V", "H4CH3D3V_e3", "11/12/2025"];
    
    if (validKeys.includes(key) || key.length > 0) { // For demo purposes, accepting any key as requested
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="h-screen w-full bg-obsidian flex flex-col items-center justify-center font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-obsidian to-obsidian opacity-80"></div>
      
      <div className="z-10 w-full max-w-md p-8 border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl rounded-sm">
        <div className="flex items-center justify-center mb-8 text-white/90">
          <Cpu className="w-12 h-12 animate-pulse-fast text-white" />
        </div>

        <div className="mb-8 space-y-1 h-32 overflow-hidden text-xs text-gray-500">
          {bootSequence.map((line, idx) => (
            <div key={idx} className="text-hache-green/80">&gt; {line}</div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              Identity Verification (BIP39 / KEY)
            </label>
            <input 
              type="password" 
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full bg-black/50 border ${error ? 'border-red-500 text-red-500' : 'border-white/20 focus:border-neon-blue text-white'} px-4 py-3 outline-none transition-all duration-300 font-mono text-sm tracking-widest placeholder-gray-700`}
              placeholder="ENTER HASH KEY..."
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs uppercase tracking-widest py-3 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4 group-hover:text-neon-blue transition-colors" />
            Authenticate
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest">
            HacheDev Technology // 2025 // Secure Terminal
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
