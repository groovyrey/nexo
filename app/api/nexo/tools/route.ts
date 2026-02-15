import { NextRequest, NextResponse } from 'next/server';
import { tools } from '../../../../lib/tools';

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: "Nexo Tools API is operational. Use POST to execute tools."
  });
}

export async function POST(req: NextRequest) {
  try {
    const { tool, args, userId, conversationId } = await req.json();

    if (!tool) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    }

    if (tool === 'webSearch') {
      const result = await tools.webSearch(args.query);
      return NextResponse.json(result);
    }

    if (tool === 'fetchUrl') {
      const result = await tools.fetchUrl(args.url);
      return NextResponse.json(result);
    }

    if (tool === 'getWeather') {
      const result = await tools.getWeather(args.location || 'auto');
      return NextResponse.json(result);
    }

    if (tool === 'writeMemory') {
      if (!userId || !conversationId) {
        return NextResponse.json({ error: 'userId and conversationId are required for writeMemory' }, { status: 400 });
      }
      const result = await tools.writeMemory(userId, conversationId, args.content);
      return NextResponse.json({ result });
    }

    if (tool === 'retrieveMemory') {
      if (!userId || !conversationId) {
        return NextResponse.json({ error: 'userId and conversationId are required for retrieveMemory' }, { status: 400 });
      }
      const result = await tools.retrieveMemory(userId, conversationId);
      return NextResponse.json(result);
    }

    // For other tools that don't strictly need server-side execution but are here for completeness
    if (tool === 'getCurrentTime') {
      return NextResponse.json(tools.getCurrentTime());
    }

    if (tool === 'getCurrentDate') {
      return NextResponse.json(tools.getCurrentDate(args.locale));
    }

    if (tool === 'listTools') {
      return NextResponse.json(tools.listTools());
    }

    return NextResponse.json({ error: `Tool "${tool}" not recognized or not implemented on server.` }, { status: 400 });
  } catch (error: any) {
    console.error(`Error executing tool:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
