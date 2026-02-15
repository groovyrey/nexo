import * as webllm from "@mlc-ai/web-llm";

declare global {
  interface Navigator {
    gpu?: {
      requestAdapter(): Promise<GPUAdapter | null>;
    };
  }
  interface GPUAdapter {
    // Add minimal properties if needed, or leave for basic support
  }
}

export type ModelRecord = {
  model_id: string;
  model_lib?: string;
  vram_required_MB?: number;
  low_resource_required?: boolean;
};

export const AVAILABLE_MODELS: ModelRecord[] = [
  {
    model_id: "Phi-3-mini-4k-instruct-q4f16_1-MLC",
    vram_required_MB: 2500,
    low_resource_required: true,
  },
  {
    model_id: "Llama-3-8B-Instruct-q4f16_1-MLC",
    vram_required_MB: 5000,
  },
  {
    model_id: "gemma-2b-it-q4f16_1-MLC",
    vram_required_MB: 1500,
    low_resource_required: true,
  },
];

let engine: webllm.MLCEngineInterface | null = null;
let currentModelId: string | null = null;

export async function checkWebGPUSupport(): Promise<{ supported: boolean; error?: string }> {
  if (typeof navigator === 'undefined' || !navigator.gpu) {
    return { 
      supported: false, 
      error: "WebGPU is not supported by this browser. Try Chrome or Edge." 
    };
  }
  
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return { 
        supported: false, 
        error: "Compatible GPU not found. WebGPU might be disabled in browser settings." 
      };
    }
    return { supported: true };
  } catch (e: any) {
    return { supported: false, error: e.message };
  }
}

export async function getEngine(
  modelId: string,
  onProgress?: (report: webllm.InitProgressReport) => void
): Promise<webllm.MLCEngineInterface> {
  if (engine && currentModelId === modelId) {
    return engine;
  }

  engine = await webllm.CreateMLCEngine(modelId, {
    initProgressCallback: onProgress,
  });
  currentModelId = modelId;

  return engine;
}

export async function chatCompletion(
  messages: any[],
  modelId: string = "Phi-3-mini-4k-instruct-q4f16_1-MLC",
  onProgress?: (report: webllm.InitProgressReport) => void
) {
  const engine = await getEngine(modelId, onProgress);
  const chunks = await engine.chat.completions.create({
    messages,
    stream: true,
  });

  return chunks;
}
