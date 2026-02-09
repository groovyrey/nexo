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
  },
  {
    type: "function",
    function: {
      name: "getWeather",
      description: "Get the current weather for a specific location or the user's current location.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and country (e.g., 'London, UK'). If the user asks about 'my weather' or doesn't specify a city, leave this blank or use 'auto'."
          }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCurrentTime",
      description: "Returns the current time in ISO format.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCurrentDate",
      description: "Returns the current date in a human-readable format (e.g., Monday, February 9, 2026).",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "fetchUrl",
      description: "Fetches the text content of a given URL. Use this to read the contents of a specific webpage when provided with a link.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The full URL to fetch (including http:// or https://)."
          }
        },
        required: ["url"]
      }
    }
  }
];

