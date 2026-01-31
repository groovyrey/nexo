import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
      console.error('HF_TOKEN is not set in environment variables.');
      return NextResponse.json({ error: 'Hugging Face Token not configured' }, { status: 500 });
    }

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: hfToken,
    });

    const transformedMessages = [
      {"role": "system", "content": "Your name is Nexo. You are a helpful AI assistant."},
      ...messages.map(msg => ({
        ...msg,
        role: msg.role === 'model' ? 'assistant' : msg.role,
      }))
    ];

    const completion = await client.chat.completions.create({
        model: "meta-llama/Llama-3.1-8B-Instruct",
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