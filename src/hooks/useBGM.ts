import { useState, useEffect, useRef, useCallback } from 'react';

export const useBGM = (url: string) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const isLoadedRef = useRef(false);

    // Initialize Audio Context and Load Buffer
    useEffect(() => {
        const initAudio = async () => {
            try {
                // Support for cross-browser AudioContext
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioContextClass();
                audioContextRef.current = ctx;

                const gainNode = ctx.createGain();
                gainNode.gain.value = 0.3; // Set default volume to 0.3
                gainNode.connect(ctx.destination);
                gainNodeRef.current = gainNode;

                // Fetch and decode the audio file
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);

                audioBufferRef.current = decodedBuffer;
                isLoadedRef.current = true;
            } catch (error) {
                console.error("Failed to load BGM:", error);
            }
        };

        initAudio();

        return () => {
            // Cleanup on unmount
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [url]);

    const play = useCallback(() => {
        if (!audioContextRef.current || !audioBufferRef.current || !gainNodeRef.current) return;

        // Resume context if suspended (browser autoplay policy compliance)
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        // Stop existing source to prevent double playing
        if (sourceNodeRef.current) {
            try { sourceNodeRef.current.stop(); } catch (e) { /* ignore */ }
        }

        // Create a new source node (nodes are single-use)
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.loop = true; // Enable seamless looping
        source.connect(gainNodeRef.current);
        source.start(0);

        sourceNodeRef.current = source;
        setIsPlaying(true);
    }, []);

    const stop = useCallback(() => {
        if (sourceNodeRef.current) {
            try {
                sourceNodeRef.current.stop();
                sourceNodeRef.current = null;
            } catch (e) {
                console.error("Error stopping audio:", e);
            }
        }
        setIsPlaying(false);
    }, []);

    const toggleBGM = useCallback(() => {
        if (isPlaying) {
            stop();
        } else {
            play();
        }
    }, [isPlaying, play, stop]);

    return { isPlaying, toggleBGM };
};
