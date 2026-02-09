'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  hasSupport: boolean;
  error: string | null;
}

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  lang?: string;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn => {
  const { onResult, onError, continuous = true, lang = 'en-US' } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [hasSupport, setHasSupport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const activeRef = useRef(false);
  const optionsRef = useRef(options);
  const instanceIdRef = useRef(0);

  // Keep options up to date
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setHasSupport(!!SpeechRecognition);
  }, []);

  const stopListening = useCallback(() => {
    activeRef.current = false;
    instanceIdRef.current++;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // Clean up existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
    }

    const instanceId = ++instanceIdRef.current;
    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognitionRef.current = recognition;
    activeRef.current = true;
    setError(null);

    const processedIndices = new Set<number>();

    recognition.onresult = (event: any) => {
      if (instanceIdRef.current !== instanceId || !activeRef.current) return;
      
      let finalTranscript = '';
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (processedIndices.has(i) && event.results[i].isFinal) continue;

        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          processedIndices.add(i);
          finalTranscript += transcriptText;
          if (optionsRef.current.onResult) optionsRef.current.onResult(transcriptText, true);
        } else {
          currentInterim += transcriptText;
          if (optionsRef.current.onResult) optionsRef.current.onResult(transcriptText, false);
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: any) => {
      if (instanceIdRef.current !== instanceId || !activeRef.current) return;
      
      let errorMessage = event.error;
      if (event.error === 'not-allowed') {
        errorMessage = 'Microphone access denied';
        stopListening();
      } else if (event.error === 'no-speech') {
        return;
      } else if (event.error === 'network') {
        errorMessage = 'Network error occurred';
        stopListening();
      }
      
      setError(errorMessage);
      if (optionsRef.current.onError && errorMessage !== event.error) optionsRef.current.onError(errorMessage);
    };

    recognition.onend = () => {
      if (instanceIdRef.current !== instanceId) return;

      if (activeRef.current) {
        // Auto-restart if still active
        setTimeout(() => {
          if (activeRef.current && instanceIdRef.current === instanceId) {
            startListening();
          }
        }, 100);
      } else {
        setIsListening(false);
      }
    };

    setIsListening(true);

    try {
      recognition.start();
    } catch (e) {
      setError('Failed to start recognition');
      setIsListening(false);
      activeRef.current = false;
    }
  }, [continuous, lang, stopListening]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    hasSupport,
    error,
  };
};
