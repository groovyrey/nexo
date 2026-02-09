import { NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference'; 
import { tools } from '../../../lib/tools'; 
import { getSystemPrompt } from '../../../lib/systemPrompt'; 
import { toolDefinitions } from '../../../lib/toolDefinitions'; // New import

const hf_token = process.env.HF_TOKEN;

if (!hf_token) {
  throw new Error("HF_TOKEN environment variable is not set. Please set it to your Hugging Face API token.");
}

const hf = new InferenceClient(hf_token);

export async function POST(req: Request) {
  try {
    const { messages, userName, userId, conversationId, userLocation, userLocale }: { messages: any[], userName: string, userId: string, conversationId: string, userLocation?: string, userLocale?: string } = await req.json();

    const personalizedSystemPrompt = await getSystemPrompt(userName, userId, conversationId);
    const safeMessages = Array.isArray(messages) ? messages : [];
    const messagesForAI = safeMessages.map(({ role, content }: { role: string; content: string; timestamp?: number }) => ({ 
      role: role === 'model' ? 'assistant' : role, 
      content 
    }));
    const fullConversationForAI = [
      { role: "system", content: personalizedSystemPrompt },
      ...messagesForAI
    ];

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          // 1️⃣ Ask model what to do
          sendEvent('status', 'Nexo is thinking...');
          const modelResponse = await hf.chatCompletion({
            model: "moonshotai/Kimi-K2.5",
            messages: fullConversationForAI,
            tools: toolDefinitions,
          });

          const message = modelResponse.choices[0].message;

          // 2️⃣ Check for tool calls
          if (message.tool_calls && message.tool_calls.length > 0) {
            const toolCall = message.tool_calls[0];
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);

            if (Object.prototype.hasOwnProperty.call(tools, functionName)) {
              const toolFunction = tools[functionName as keyof typeof tools];
              
              // Mapping tool names to user-friendly status messages
              const statusMessages: Record<string, string> = {
                webSearch: `Nexo is searching the web for "${functionArgs.query}"...`,
                getCurrentTime: "Nexo is checking the time...",
                getCurrentDate: "Nexo is checking the date...",
                fetchUrl: `Nexo is reading ${functionArgs.url}...`,
                writeMemory: "Nexo is remembering this...",
                retrieveMemory: "Nexo is accessing memories...",
                listTools: "Nexo is checking its capabilities...",
                getWeather: `Nexo is checking the weather for ${functionArgs.location || 'your location'}...`
              };

              sendEvent('status', statusMessages[functionName] || `Nexo is using ${functionName}...`);
              
              let toolResult: any;
              if (functionName === 'webSearch') {
                toolResult = await (toolFunction as typeof tools.webSearch)(functionArgs.query);
              } else if (functionName === 'getCurrentTime') {
                toolResult = await (toolFunction as typeof tools.getCurrentTime)();
              } else if (functionName === 'getCurrentDate') {
                toolResult = (toolFunction as typeof tools.getCurrentDate)(userLocale || 'en-US');
              } else if (functionName === 'fetchUrl') {
                toolResult = await (toolFunction as typeof tools.fetchUrl)(functionArgs.url);
              } else if (functionName === 'writeMemory') {
                toolResult = await tools.writeMemory(userId, conversationId, (functionArgs as { content: string }).content);
              } else if (functionName === 'retrieveMemory') {
                toolResult = await (toolFunction as typeof tools.retrieveMemory)(userId, conversationId);
              } else if (functionName === 'listTools') {
                toolResult = (toolFunction as typeof tools.listTools)();
              } else if (functionName === 'getWeather') {
                toolResult = await (toolFunction as typeof tools.getWeather)(functionArgs.location || userLocation || 'auto');
              }

              sendEvent('toolResult', { toolUsed: functionName, toolOutput: toolResult });
              sendEvent('status', 'Nexo is processing results...');

              // 3️⃣ Send tool result back to model for final answer
              const finalResponse = await hf.chatCompletion({
                model: "moonshotai/Kimi-K2.5",
                messages: [
                  ...fullConversationForAI,
                  message,
                  {
                    role: "tool",
                    content: typeof toolResult === 'object' && toolResult !== null && 'summary' in toolResult ? toolResult.summary : JSON.stringify(toolResult),
                    tool_call_id: toolCall.id,
                  },
                ]
              });

              sendEvent('result', {
                response: finalResponse.choices[0].message.content,
                toolUsed: functionName,
                toolOutput: toolResult
              });
            } else {
              sendEvent('error', `Tool "${functionName}" not recognized.`);
            }
          } else {
            // No tool needed
            sendEvent('result', {
              response: message.content,
              toolUsed: null
            });
          }
        } catch (err: any) {
          sendEvent('error', err.message);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: any) {
    console.error("API route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
