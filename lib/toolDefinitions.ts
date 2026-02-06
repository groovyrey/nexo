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
  },
  {
    type: "function",
    function: {
      name: "writeMemory",
      description: "Overwrites the entire stored memory for the current conversation. The model is responsible for constructing the full memory string to be saved.",
      parameters: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "The complete memory string to be stored, overwriting any previous memory."
          }
        },
        required: ["content"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "retrieveMemory",
      description: "Retrieves the entire stored memory string for the current conversation.",
      parameters: {
        type: "object",
        properties: {}, // No properties, as it takes no arguments
        required: [] // No required arguments
      }
    }
  },
  {
    type: "function",
    function: {
      name: "listTools",
      description: "Lists all available tools and their descriptions.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  }
];

