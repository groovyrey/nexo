/**
 * Nexo On-Device AI Library
 * Integrates Transformers.js, Vosk, TensorFlow.js, and brain.js for local inference.
 */

import { pipeline } from '@huggingface/transformers';
import { tools } from './tools';

export class OnDeviceAI {
  private static instance: OnDeviceAI;
  private chatPipeline: any = null;
  private classifier: any = null;

  private constructor() {}

  public static getInstance(): OnDeviceAI {
    if (!OnDeviceAI.instance) {
      OnDeviceAI.instance = new OnDeviceAI();
    }
    return OnDeviceAI.instance;
  }

  /**
   * Initialize a small local LLM using Transformers.js
   */
  async initLocalLLM(modelName: string = 'Xenova/Qwen1.5-0.5B-Chat') {
    if (this.chatPipeline) return this.chatPipeline;
    console.log('Initializing local LLM:', modelName);
    this.chatPipeline = await pipeline('text-generation', modelName);
    return this.chatPipeline;
  }

  /**
   * Run inference locally with simple tool heuristics
   */
  async generateText(prompt: string, maxTokens: number = 200): Promise<string> {
    if (!this.chatPipeline) {
      await this.initLocalLLM();
    }

    const lowerPrompt = prompt.toLowerCase();
    let toolContext = '';
    
    try {
      if (lowerPrompt.includes('weather') || lowerPrompt.includes('temperature')) {
        const locMatch = lowerPrompt.match(/in\s+([a-z\s]+)/i);
        const location = locMatch ? locMatch[1].trim() : 'auto';
        const weather = await tools.getWeather(location);
        toolContext = `Current weather in ${location}: ${weather}`;
      } else if (lowerPrompt.includes('time')) {
        toolContext = `Current time: ${tools.getCurrentTime()}`;
      } else if (lowerPrompt.includes('date')) {
        toolContext = `Current date: ${tools.getCurrentDate()}`;
      } else if (lowerPrompt.startsWith('search') || lowerPrompt.includes('who is') || lowerPrompt.includes('what is')) {
         const query = prompt.replace(/search for|search|who is|what is/gi, '').trim();
         if (query.length > 2) {
             const results = await tools.webSearch(query);
             toolContext = `Search results: ${JSON.stringify(results)}`;
         }
      }
    } catch (e) {
      console.error('Local tool execution failed:', e);
    }

    // Construct a chat-like prompt for the model
    let fullPrompt = `<|system|>\nYou are a helpful assistant.`;
    if (toolContext) {
        fullPrompt += `\n<|user|>\nHere is some context: ${toolContext}\n${prompt}`;
    } else {
        fullPrompt += `\n<|user|>\n${prompt}`;
    }
    fullPrompt += `\n<|assistant|>\n`;

    const output = await this.chatPipeline(fullPrompt, {
      max_new_tokens: maxTokens,
      temperature: 0.7,
      do_sample: true,
      return_full_text: false,
    });

    // Clean up the output if necessary (Transformers.js usually handles chat templates well but fallback is good)
    let response = Array.isArray(output) ? output[0].generated_text : output.generated_text;
    return response.replace(/<\|.*?\|>/g, '').trim();
  }

  /**
   * Vosk-based Speech-to-Text (Placeholder logic)
   * In a real implementation, this would involve loading the Vosk model and processing audio streams.
   */
  async initVoskSTT() {
    // This requires vosk-browser and a model URL
    // const { createModel } = await import('vosk-browser');
    // const model = await createModel(MODEL_URL);
    console.log('Vosk STT Initialized (Mock)');
  }

  /**
   * simple brain.js classification example
   */
  async trainSimpleClassifier(data: any[]) {
    if (typeof window === 'undefined') return;
    const brain = await import('brain.js');
    const net = new brain.recurrent.LSTM();
    net.train(data, { iterations: 100 });
    this.classifier = net;
    return net;
  }

  /**
   * TensorFlow.js example: Sentiment Analysis
   */
  async analyzeSentiment(text: string) {
    const tf = await import('@tensorflow/tfjs');
    // This is a placeholder for actual TF.js model loading and inference
    console.log('Analyzing sentiment for:', text, 'using TF.js');
    return { score: 0.8, label: 'positive' };
  }
}

export const onDeviceAI = OnDeviceAI.getInstance();
