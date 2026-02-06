// lib/tools.ts
import { webSearch as originalWebSearch } from '../app/api/nexo/tools/webSearch';
import { writeMemoryToConversation, retrieveConsolidatedMemory } from './realtimedb'; // Updated import
import { toolDefinitions } from './toolDefinitions';

export type ToolsType = {
  webSearch: (query: string, count?: number, summary?: boolean) => Promise<any>;
  getCurrentTime: () => string;
  writeMemory: (userId: string, conversationId: string, content: string) => string; // Changed to string for diagnosis
  retrieveMemory: (userId: string, conversationId: string) => Promise<string | null>; // Updated signature
  listTools: () => string;
};

export const tools: ToolsType = {
  webSearch: async (query: string) => {
    return originalWebSearch(query);
  },

  getCurrentTime: () => new Date().toISOString(),

  writeMemory: (userId: string, conversationId: string, content: string) => { // Removed async for diagnosis
    console.log("Dummy writeMemory called with:", userId, conversationId, content);
    return `Dummy memory written for ${userId}, ${conversationId} with content: "${content}"`;
  },

  retrieveMemory: async (userId: string, conversationId: string) => { // Removed query
    return retrieveConsolidatedMemory(userId, conversationId);
  },

  listTools: () => {
    return JSON.stringify(toolDefinitions);
  },
};