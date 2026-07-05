import React, { useEffect, useState } from 'react';
import { NuronLogEntry } from '../types';

const generateHash = () => {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

const NuronLog: React.FC = () => {
  const [logs, setLogs] = useState<NuronLogEntry[]>([]);

  useEffect(() => {
    // Initial Log
    setLogs([{
      hash: "H4CH3D3V_INIT_SEQUENCE_VERIFIED",
      timestamp: new Date().toISOString(),
      signature: "PMD_ORIGIN"
    }]);

    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = {
          hash: generateHash(),
          timestamp: new Date().toISOString(),
          signature: "NEURAL_SIGN_VALID"
        };
        const updated = [newLog, ...prev];
        return updated.slice(0, 5); // Keep last 5
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[10px] text-gray-600 border-t border-gray-800 pt-2 mt-4">
      <div className="flex justify-between items-center mb-1">
        <span className="uppercase tracking-widest text-hache-green/50">Nuron Log // Secure Trace</span>
        <div className="h-1 w-1 bg-hache-green rounded-full animate-pulse"></div>
      </div>
      <div className="space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className={`flex justify-between ${idx === 0 ? 'text-gray-400' : 'opacity-40'}`}>
            <span className="truncate w-1/2">{log.hash}</span>
            <span className="text-right">{log.timestamp.split('T')[1].substring(0,8)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NuronLog;
