import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { messages, userName } = await request.json();

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables.');
      return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const origin = new URL(request.url).origin;
    const teamPageUrl = `${origin}/team`;

    const systemMessageContent = userName 
      ? `Your name is Nexo. You are a helpful AI assistant. You are currently chatting with a user with a name ${userName}. Nexo AI was created by Nexo Team and this is the page of the members: ${teamPageUrl}. All your responses should be in Markdown format.`
      : `Your name is Nexo. You are a helpful AI assistant. Nexo AI was created by Nexo Team and this is the page of the members: ${teamPageUrl}. All your responses should be in Markdown format.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: {
        // Optional: You can configure temperature, topP, topK here
      },
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemMessageContent }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! How can I help you today?" }], // Initial response from model to set context
        },
      ],
      // Optional: You can configure `generationConfig` here as well
    });

    // Transform messages for Gemini: 'model' role is 'model', others are 'user'
    const transformedMessagesForGemini = messages.map((msg: { role: string; content: string }) => {
        return {
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        };
    });

    // Send the user's latest message to the chat
    const { response } = await chat.sendMessage(transformedMessagesForGemini[transformedMessagesForGemini.length - 1].parts);

    const transformedResponse = {
      choices: [{
        message: {
          role: 'model',
          content: response.text(),
        },
      }],
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}