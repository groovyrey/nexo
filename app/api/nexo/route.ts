import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { messages, userName } = await request.json();

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
      console.error('HF_TOKEN is not set in environment variables.');
      return NextResponse.json({ error: 'Hugging Face Token not configured' }, { status: 500 });
    }

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: hfToken,
    });

    const origin = new URL(request.url).origin;
    const teamPageUrl = `${origin}/team`;

    const systemMessageContent = userName 
      ? `Your name is Nexo. You are a helpful AI assistant. You are currently chatting with ${userName}. Nexo AI was created by Nexo Team and this is the page of the members: ${teamPageUrl}.`
      : `Your name is Nexo. You are a helpful AI assistant. Nexo AI was created by Nexo Team and this is the page of the members: ${teamPageUrl}.`;

    const transformedMessages = [
      {"role": "system", "content": systemMessageContent},
      ...messages.map((msg: { role: string; content: string }) => ({
        ...msg,
        role: msg.role === 'model' ? 'assistant' : msg.role,
      }))
    ];

    const completion = await client.chat.completions.create({
        model: "CohereLabs/c4ai-command-r-08-2024",
        messages: transformedMessages,
    });

    const transformedResponse = {
      choices: [{
        message: {
          role: 'model',
          content: completion.choices[0].message.content,
        },
      }],
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}