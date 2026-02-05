// lib/tools.ts
import { webSearch as originalWebSearch } from '../app/api/nexo/tools/webSearch';

export type ToolsType = {
  webSearch: (query: string, count?: number, summary?: boolean) => Promise<any>;
  getCurrentTime: () => string;
};

export const tools: ToolsType = {
  webSearch: async (query: string) => {
    return originalWebSearch(query);
  },

  getCurrentTime: () => new Date().toISOString(),
};