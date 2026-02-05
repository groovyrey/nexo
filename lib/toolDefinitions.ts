export const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "webSearch",
      description: "A tool for performing web searches. Use this when the user asks a question that requires external knowledge or current information, such as asking for definitions, facts, or news.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query."
          }
        },
        required: ["query"]
      }
    }
  }
];
