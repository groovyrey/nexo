import { NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference'; 
import { tools } from '../../../lib/tools'; 
import { systemPrompt } from '../../../lib/systemPrompt'; 
import { toolDefinitions } from '../../../lib/toolDefinitions'; // New import

const hf = new InferenceClient(process.env.HF_TOKEN!);

export async function POST(req: Request) {
  try {
        const { messages } = await req.json();
        const userMessage = messages[messages.length - 1].content;
        console.log("User message:", userMessage);    
        // 1️⃣ Ask model what to do, passing the tool definitions
        const modelResponse = await hf.chatCompletion({
          model: "Qwen/Qwen2.5-7B-Instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          tools: toolDefinitions, // Pass tool definitions here
        });
        console.log("Model initial response:", JSON.stringify(modelResponse, null, 2));
    
        const message = modelResponse.choices[0].message;
    
        // 2️⃣ Check for tool calls
        if (message.tool_calls && message.tool_calls.length > 0) {
          const toolCall = message.tool_calls[0]; // Assuming one tool call for simplicity
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          console.log("Tool call detected:", { functionName, functionArgs });
    
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
          
                      console.log("Tool execution result (summary):", toolResult.results && toolResult.results.length > 0 ? toolResult.results[0].summary : "No summary found.");
          
                      // 3️⃣ Send tool result back to model for final answer
                      const finalResponse = await hf.chatCompletion({
                        model: "Qwen/Qwen2.5-7B-Instruct",
                        messages: [
                          { role: "system", content: systemPrompt },
                          { role: "user", content: userMessage },
                          {
                            role: "tool", // Use 'tool' role for tool output
                            content: JSON.stringify(toolResult),
                            tool_call_id: toolCall.id,
                          },
                        ]
                      });
                      console.log("Model final response:", JSON.stringify(finalResponse, null, 2));
                      return NextResponse.json({ response: finalResponse.choices[0].message.content });
                    } else {
                      return NextResponse.json({ error: `Tool "${functionName}" not found or recognized.` }, { status: 500 });
                    }        } else {
          // No tool needed, or model generated a direct response
          console.log("No tool call. Model direct response:", JSON.stringify(message, null, 2));
          return NextResponse.json({ response: message.content });
        }
      } catch (err: any) {
        console.error("API route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
