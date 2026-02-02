import { NextRequest, NextResponse } from 'next/server';
import { webSearch } from './webSearch';

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
  ];

  return NextResponse.json({ tools });
}

export async function POST(req: NextRequest) {
  const { tool, query } = await req.json();

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
  }

  return NextResponse.json({ error: 'Invalid tool' }, { status: 400 });
}
