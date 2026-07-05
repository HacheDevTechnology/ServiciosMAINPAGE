export interface FileNode {
  name: string;
  kind: 'file' | 'directory';
  handle: any; // Using any for FileSystemHandle to avoid standard DOM library mismatches
  children?: FileNode[];
  path: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface SystemConfig {
  systemPrompt: string;
  temperature: number;
  model: string;
}

export enum AppState {
  LOCKED = 'LOCKED',
  BOOTING = 'BOOTING',
  ACTIVE = 'ACTIVE',
}

export interface NuronLogEntry {
  hash: string;
  timestamp: string;
  signature: string;
}
