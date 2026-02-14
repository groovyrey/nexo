// lib/tools.ts
import { writeMemoryToConversation, retrieveConsolidatedMemory } from './realtimedb'; // Updated import
import { toolDefinitions } from './toolDefinitions';

// Helper to detect if running on client
const isClient = typeof window !== 'undefined';

export type ToolsType = {
  webSearch: (query: string) => Promise<any>;
  getCurrentTime: () => string;
  writeMemory: (userId: string, conversationId: string, content: string) => Promise<string>;
  retrieveMemory: (userId: string, conversationId: string) => Promise<string | null>;
  listTools: () => string;
  getWeather: (location: string) => Promise<string>;
  getCurrentDate: (locale?: string) => string;
  fetchUrl: (url: string) => Promise<string>;
};

export const tools: ToolsType = {
  webSearch: async (query: string) => {
    if (isClient) {
      // Client-side: Call the API route
      const response = await fetch('/api/nexo/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'Web Search', query }),
      });
      if (!response.ok) throw new Error('Web search failed');
      return response.json();
    } else {
      // Server-side: Import dynamically to avoid build errors on client
      const { webSearch: serverWebSearch } = await import('../app/api/nexo/tools/webSearch');
      return serverWebSearch(query);
    }
  },

  getCurrentTime: () => new Date().toISOString(),

  getCurrentDate: (locale: string = 'en-US') => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
  },

  fetchUrl: async (url: string) => {
    if (isClient) {
      // Client-side: Use a proxy to avoid CORS
      const response = await fetch('/api/nexo/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'Fetch URL', url }), // Ensure route handles this
      });
      if (!response.ok) throw new Error('Fetch URL failed');
      return response.text();
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      const html = await response.text();
      
      // Extract title
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : url;

      // Simple HTML to text conversion
      const text = html
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const content = text.length > 5000 ? text.substring(0, 5000) + "..." : text;

      return JSON.stringify({
        title,
        url,
        content
      });
    } catch (error: any) {
      console.error('Error in fetchUrl tool:', error);
      return JSON.stringify({ error: error.message, url });
    }
  },

  writeMemory: async (userId: string, conversationId: string, content: string) => { // Restored async implementation
    return writeMemoryToConversation(userId, conversationId, content);
  },

  retrieveMemory: async (userId: string, conversationId: string) => { // Removed query
    return retrieveConsolidatedMemory(userId, conversationId);
  },

  listTools: () => {
    return JSON.stringify(toolDefinitions);
  },

  getWeather: async (location: string) => {
    try {
      // Using wttr.in for simple weather data. 'auto' will use the IP-based location of the server,
      // but we are passing the client's detected location when possible.
      const searchLocation = location === 'auto' ? '' : location;
      const response = await fetch(`https://wttr.in/${encodeURIComponent(searchLocation)}?format=j1`);
      if (!response.ok) {
        throw new Error(`Weather service error: ${response.statusText}`);
      }
      const data = await response.json();
      const current = data.current_condition[0];
      const weatherDesc = current.weatherDesc[0].value;
      const tempC = current.temp_C;
      const humidity = current.humidity;
      const windSpeed = current.windspeedKmph;

      return JSON.stringify({
        location: location === 'auto' ? data.nearest_area[0].areaName[0].value : location,
        condition: current.weatherDesc[0].value,
        tempC: current.temp_C,
        humidity: current.humidity,
        windSpeed: current.windspeedKmph,
        description: `Current weather in ${location}: ${weatherDesc}, Temperature: ${tempC}°C, Humidity: ${humidity}%, Wind Speed: ${windSpeed} km/h.`
      });
    } catch (error: any) {
      console.error('Error in getWeather tool:', error);
      return JSON.stringify({ error: error.message, location });
    }
  },
};