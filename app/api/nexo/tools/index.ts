
export const tools: any[] = [];

export async function executeTool(toolCall: { function: { name: string; arguments: string; }; }) {
  throw new Error(`Unknown tool: ${toolCall.function.name}`);
}
