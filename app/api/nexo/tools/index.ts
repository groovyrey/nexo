interface Tool {
  name: string;
  // Add other properties as tools are defined
}

export const tools: Tool[] = [];
export async function executeTool(toolCall: { function: { name: string; arguments: string; }; }) {
  throw new Error(`Unknown tool: ${toolCall.function.name}`);
}
