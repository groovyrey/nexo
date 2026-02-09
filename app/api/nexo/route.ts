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

    // Ensure messages is an array, default to empty array if not present or null
    const safeMessages = Array.isArray(messages) ? messages : [];

    // Filter out timestamp from messages and prepare for AI
    const messagesForAI = safeMessages.map(({ role, content }: { role: string; content: string; timestamp?: number }) => ({ role, content }));
                                                
                                                                // Extract the last user message content
                                                                const lastUserMessage = messagesForAI.length > 0 ? messagesForAI[messagesForAI.length - 1].content : "";
                                                
                                                                // Prepend the personalized system prompt to the messages array
                                                                const fullConversationForAI = [
                                                                  { role: "system", content: personalizedSystemPrompt },
                                                                  ...messagesForAI
                                                                ];
                                                
                                                                // 1️⃣ Ask model what to do, passing the tool definitions
                                                                const modelResponse = await hf.chatCompletion({
                                                                  model: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
                                                                  messages: fullConversationForAI, // Pass the full conversation history
                                                                  tools: toolDefinitions, // Pass tool definitions here
                                                                });
                                    
                                        const message = modelResponse.choices[0].message;
                                
                                    
                                        // 2️⃣ Check for tool calls
                                        if (message.tool_calls && message.tool_calls.length > 0) {
                                          const toolCall = message.tool_calls[0]; // Assuming one tool call for simplicity
                                          const functionName = toolCall.function.name;
                                          const functionArgs = JSON.parse(toolCall.function.arguments);
                                
                                    
                                                    // Type guard to ensure functionName is a valid key of ToolsType
                                                    if (Object.prototype.hasOwnProperty.call(tools, functionName)) {
                                                      const toolFunction = tools[functionName as keyof typeof tools];
                                                      
                                                      let toolResult: any;
                                                      if (functionName === 'webSearch') {
                                                        toolResult = await (toolFunction as typeof tools.webSearch)(functionArgs.query);
                                                      } else if (functionName === 'getCurrentTime') {
                                                        toolResult = await (toolFunction as typeof tools.getCurrentTime)();
                                                      } else if (functionName === 'getCurrentDate') {
                                                        toolResult = (toolFunction as typeof tools.getCurrentDate)(userLocale || 'en-US');
                                                      } else if (functionName === 'fetchUrl') {
                                                        toolResult = await (toolFunction as typeof tools.fetchUrl)(functionArgs.url);
                                                      } else if (functionName === 'writeMemory') { // Handle writeMemory
                                                        toolResult = await tools.writeMemory(userId, conversationId, (functionArgs as { content: string }).content);
                                                      } else if (functionName === 'retrieveMemory') { // Handle retrieveMemory
                                                        toolResult = await (toolFunction as typeof tools.retrieveMemory)(userId, conversationId); // Removed functionArgs.query
                                                                            } else if (functionName === 'listTools') { // Handle listTools
                                                                              toolResult = (toolFunction as typeof tools.listTools)();
                                                                            } else if (functionName === 'getWeather') { // Handle getWeather
                                                                              toolResult = await (toolFunction as typeof tools.getWeather)(functionArgs.location || userLocation || 'auto');
                                                                            } else {
                                                        return NextResponse.json({ error: `Tool "${functionName}" is not explicitly handled or recognized.` }, { status: 500 });
                                                      }
                                          
                                
                                          
                                                      // 3️⃣ Send tool result back to model for final answer
                                                      const finalResponse = await hf.chatCompletion({
                                                        model: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
                                                        messages: [
                                                          ...fullConversationForAI, // Include the full conversation history
                                                          message, // The model's original message that contained the tool call
                                                          {
                                                            role: "tool", // Use 'tool' role for tool output
                                                            content: typeof toolResult === 'object' && toolResult !== null && 'summary' in toolResult ? toolResult.summary : JSON.stringify(toolResult),
                                                            tool_call_id: toolCall.id,
                                                          },
                                                        ]
                                                      });
          return NextResponse.json({
            response: finalResponse.choices[0].message.content,
            toolUsed: functionName,
            toolOutput: toolResult // Include raw tool output
          });
        } else {
          return NextResponse.json({ error: `Tool "${functionName}" not found or recognized.` }, { status: 500 });
        }
      } else {
        // No tool needed, or model generated a direct response
        return NextResponse.json({
          response: message.content,
          toolUsed: null
        });
      }
    } catch (err: any) {
        console.error("API route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
