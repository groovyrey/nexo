import { NextRequest, NextResponse } from 'next/server';
import { webSearch } from './webSearch';
import { tools as libTools } from '../../../../../lib/tools'; // Import server-side tool logic

export async function GET(req: NextRequest) {
  const tools = [
    {
      name: 'Get Weather',
      description: 'Get the weather for a specific location',
    },
    {
      name: 'Get Stock Price',
      description: 'Get the stock price for a specific symbol',
    },
    {
      name: 'Web Search',
      description: 'Search the web for a specific query',
    },
    {
      name: 'Fetch URL',
      description: 'Fetch content of a URL',
    }
  ];

  return NextResponse.json({ tools });
}

export async function POST(req: NextRequest) {
  const { tool, query, url } = await req.json();

  if (tool === 'Web Search') {
    try {
      const results = await webSearch(query);
      return NextResponse.json(results);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  } else if (tool === 'Fetch URL') {
    try {
      // Use the server-side implementation directly
      // Note: libTools.fetchUrl might recurse if we are not careful about isClient check.
      // However, on server, isClient is false, so it runs the node-fetch logic.
      const result = await libTools.fetchUrl(url);
      return new NextResponse(result); 
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid tool' }, { status: 400 });
}
