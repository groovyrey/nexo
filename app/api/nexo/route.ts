import { NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference'; 
import { tools } from '../../../lib/tools'; 
import { getSystemPrompt } from '../../../lib/systemPrompt'; 
import { toolDefinitions } from '../../../lib/toolDefinitions'; // New import

const hf = new InferenceClient(process.env.HF_TOKEN!);

export async function POST(req: Request) {
  try {
                const { messages, userName } = await req.json();
                const personalizedSystemPrompt = getSystemPrompt(userName); // Generate personalized system prompt
                // Filter out timestamp from messages as it's not part of the expected OpenAI message format
                const messagesForAI = messages.map(({ role, content }: { role: string; content: string; timestamp?: number }) => ({ role, content }));
                const userMessage = messagesForAI[messagesForAI.length - 1].content;
        
                // 1️⃣ Ask model what to do, passing the tool definitions
                const modelResponse = await hf.chatCompletion({
                  model: "Qwen/Qwen2.5-7B-Instruct",
                  messages: [
                    { role: "system", content: personalizedSystemPrompt },
                    { role: "user", content: userMessage }
                  ],
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
                        toolResult = await toolFunction(functionArgs.query);
                      } else if (functionName === 'getCurrentTime') {
                        toolResult = await (toolFunction as typeof tools.getCurrentTime)();
                      } else {
                        return NextResponse.json({ error: `Tool "${functionName}" is not explicitly handled or recognized.` }, { status: 500 });
                      }
          

          
                      // 3️⃣ Send tool result back to model for final answer
                      const finalResponse = await hf.chatCompletion({
                        model: "Qwen/Qwen2.5-7B-Instruct",
                        messages: [
                          { role: "system", content: personalizedSystemPrompt },
                          { role: "user", content: userMessage },
                          {
                            role: "tool", // Use 'tool' role for tool output
                            content: JSON.stringify(toolResult),
                            tool_call_id: toolCall.id,
                          },
                        ]
                      });

                      return NextResponse.json({ response: finalResponse.choices[0].message.content });
                    } else {
                      return NextResponse.json({ error: `Tool "${functionName}" not found or recognized.` }, { status: 500 });
                    }        } else {
          // No tool needed, or model generated a direct response

          return NextResponse.json({ response: message.content });
        }
      } catch (err: any) {
        console.error("API route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
