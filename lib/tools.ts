// lib/tools.ts
import { webSearch as originalWebSearch } from '../app/api/nexo/tools/webSearch';
import { writeMemoryToConversation, retrieveConsolidatedMemory } from './realtimedb'; // Updated import
import { toolDefinitions } from './toolDefinitions';

export type ToolsType = {
  webSearch: (query: string) => Promise<any>;
  getCurrentTime: () => string;
  writeMemory: (userId: string, conversationId: string, content: string) => Promise<string>; // Restored original signature
  retrieveMemory: (userId: string, conversationId: string) => Promise<string | null>; // Updated signature
  listTools: () => string;
};

export const tools: ToolsType = {
  webSearch: async (query: string) => {
    return originalWebSearch(query);
  },

  getCurrentTime: () => new Date().toISOString(),

  writeMemory: async (userId: string, conversationId: string, content: string) => { // Restored async implementation
    return writeMemoryToConversation(userId, conversationId, content);
  },

  retrieveMemory: async (userId: string, conversationId: string) => { // Removed query
    return retrieveConsolidatedMemory(userId, conversationId);
  },

  listTools: () => {
    return JSON.stringify(toolDefinitions);
  },
};