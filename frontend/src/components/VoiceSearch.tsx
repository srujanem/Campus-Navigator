import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceSearchProps {
    onResult: (transcript: string) => void;
    disabled?: boolean;
    language?: string; // e.g. 'en-US', 'hi-IN', 'ta-IN'
}

// Browser Speech Recognition API
const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const VoiceSearch: React.FC<VoiceSearchProps> = ({ onResult, disabled, language = 'en-US' }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript]   = useState('');
    const [status, setStatus]           = useState<'idle' | 'listening' | 'processing' | 'unsupported'>('idle');
    const recognitionRef                = useRef<any>(null);

    const supported = !!SpeechRecognition;

    const startListening = useCallback(() => {
        if (!supported || isListening) return;

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = language;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setStatus('listening');
            setTranscript('');
        };

        recognition.onresult = (event: any) => {
            const result = event.results[0][0].transcript;
            setTranscript(result);
            if (event.results[0].isFinal) {
                setStatus('processing');
                onResult(result);
                setTimeout(() => {
                    setIsListening(false);
                    setStatus('idle');
                    setTranscript('');
                }, 800);
            }
        };

        recognition.onerror = () => {
            setIsListening(false);
            setStatus('idle');
        };

        recognition.onend = () => {
            if (status === 'listening') {
                setIsListening(false);
                setStatus('idle');
            }
        };

        recognition.start();
    }, [supported, isListening, language, onResult, status]);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
        setStatus('idle');
    }, []);

    if (!supported) return (
        <button disabled className="p-2 rounded-lg bg-slate-100 text-slate-300 cursor-not-allowed" title="Voice not supported in this browser">
            <MicOff size={16} />
        </button>
    );

    return (
        <div className="relative flex items-center gap-2">
            <button
                onClick={isListening ? stopListening : startListening}
                disabled={disabled}
                title={isListening ? 'Stop listening' : 'Speak your destination'}
                className={`p-2 rounded-lg transition-all ${
                    isListening
                        ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
                        : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500'
                } disabled:opacity-40`}
            >
                {status === 'processing' ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />}
            </button>

            {/* Live transcript bubble */}
            {isListening && (
                <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-50 max-w-[200px] truncate">
                    {transcript || '🎤 Listening…'}
                </div>
            )}
        </div>
    );
};

/* ─── Text-to-Speech helper ─────────────────────────── */
export const speak = (text: string, lang: string = 'en-US') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // stop any current speech
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.95;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
};

export const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
};
