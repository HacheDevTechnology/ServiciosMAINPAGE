import React, { useState, useEffect } from 'react';
import { Folder, HardDrive, ShieldAlert, Cpu } from 'lucide-react';
import Login from './components/Login';
import Terminal from './components/Terminal';
import NuronLog from './components/NuronLog';
import NeuralLava from './components/NeuralLava';
import { AppState, ChatMessage, FileNode, SystemConfig } from './types';
import { DEFAULT_SYSTEM_PROMPT, MODELS } from './constants';
import { sendMessageToGemini, generateAgentImage } from './services/geminiService';
import { pickDirectory, readDirectory } from './services/fileSystem';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LOCKED);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [localVault, setLocalVault] = useState<FileNode | null>(null);
  const [vaultFiles, setVaultFiles] = useState<FileNode[]>([]);
  
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    temperature: 0.2,
    model: MODELS.FLASH,
  });

  const handleUnlock = () => {
    setAppState(AppState.BOOTING);
    setTimeout(() => {
      setAppState(AppState.ACTIVE);
      setMessages([{
        id: Date.now().toString(),
        role: 'system',
        text: 'HacheDev Búnker Node Initialized. PMD Origin verified. Local server isolation ready.',
        timestamp: Date.now()
      }]);
    }, 1500);
  };

  const handleMountVault = async () => {
    const root = await pickDirectory();
    if (root) {
      setLocalVault(root);
      const children = await readDirectory(root);
      setVaultFiles(children);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);
    setGeneratedImage(null); // Reset image on new prompt

    try {
      // Check for image generation command
      if (text.toLowerCase().startsWith('/image ')) {
        const prompt = text.replace('/image ', '');
        const imgBase64 = await generateAgentImage(prompt);
        if (imgBase64) {
          setGeneratedImage(imgBase64);
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: `[IMAGE_RENDER_SUCCESS] Visualization generated in Neural Core.`,
            timestamp: Date.now()
          }]);
        } else {
           setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'system',
            text: `[SYSTEM_ERROR] Could not generate visualization. Check API Key or Image model access.`,
            timestamp: Date.now()
          }]);
        }
      } else {
        // Normal Chat
        const history = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, text: m.text }));
        const response = await sendMessageToGemini(text, history, systemConfig);
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: response,
          timestamp: Date.now()
        }]);
      }
    } catch (e) {
       console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (appState === AppState.LOCKED) {
    return <Login onUnlock={handleUnlock} />;
  }

  if (appState === AppState.BOOTING) {
     return (
       <div className="h-screen w-full bg-obsidian flex items-center justify-center font-mono">
         <div className="text-neon-blue flex flex-col items-center gap-4">
            <Cpu className="w-16 h-16 animate-spin" />
            <span className="tracking-[0.5em] text-sm uppercase">Mounting Zero Memory File System...</span>
         </div>
       </div>
     )
  }

  return (
    <div className="h-screen w-full bg-void text-gray-300 font-sans flex overflow-hidden">
      <div className="scanline-overlay"></div>
      
      {/* LEFT PANEL: LOCAL VAULT (File Manager) */}
      <div className="w-64 border-r border-white/5 bg-black/40 flex flex-col backdrop-blur-md relative z-10">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-hache-green" />
            Local Vault
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {!localVault ? (
             <button 
               onClick={handleMountVault}
               className="w-full py-3 border border-dashed border-gray-700 hover:border-hache-green hover:text-hache-green transition-colors text-xs font-mono rounded-sm flex flex-col items-center gap-2"
             >
               <Folder className="w-6 h-6" />
               Mount Offline Server Dir
             </button>
          ) : (
             <div className="space-y-2">
               <div className="text-xs font-mono text-neon-blue mb-4 pb-2 border-b border-white/5 truncate">
                 [{localVault.path}]
               </div>
               {vaultFiles.map((file, i) => (
                 <div key={i} className="flex items-center gap-2 text-xs font-mono hover:bg-white/5 p-1 rounded-sm cursor-pointer transition-colors">
                   {file.kind === 'directory' ? <Folder className="w-3 h-3 text-yellow-500" /> : <ShieldAlert className="w-3 h-3 text-gray-500" />}
                   <span className="truncate">{file.name}</span>
                 </div>
               ))}
             </div>
          )}
        </div>
        
        <div className="p-4 bg-black/50 border-t border-white/5">
          <NuronLog />
        </div>
      </div>

      {/* CENTER PANEL: TERMINAL */}
      <div className="flex-1 p-6 relative z-10 flex flex-col h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/40 via-void to-void">
        <Terminal 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isProcessing={isProcessing} 
          systemConfig={systemConfig}
        />
      </div>

      {/* RIGHT PANEL: NEURAL LAVA CORE */}
      <NeuralLava isProcessing={isProcessing} generatedImage={generatedImage} />
    </div>
  );
}

export default App;
