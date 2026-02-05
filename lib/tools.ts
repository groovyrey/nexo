// lib/tools.ts
import { webSearch as originalWebSearch } from '../app/api/nexo/tools/webSearch';

export const tools = {
  webSearch: async (query: string) => {
    return originalWebSearch(query);
  },

  getCurrentTime: () => new Date().toISOString(),
};