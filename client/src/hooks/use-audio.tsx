import { useCallback, useRef, useEffect } from 'react';
import { 
  setupAudioContext, 
  createMetronomeSound,
  createKeySound,
  speakLetterWithSynthesis,
  playPannedToneForLetter
} from '@/lib/audio-service';

interface UseAudioOptions {
  bpm?: number;
  volume?: number;
  metronomeActive?: boolean;
  speechActive?: boolean;
  panningActive?: boolean;
  keySoundsActive?: boolean;
}

export function useAudio(options: UseAudioOptions = {}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<number | null>(null);
  
  // Initialize audio context when needed
  useEffect(() => {
    // Initialize the audio context on the first user interaction
    const handleFirstInteraction = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = setupAudioContext();
      }
      
      // Remove the event listeners once audio is initialized
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      
      // Clean up audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Metronome control functions
  const startMetronome = useCallback(() => {
    if (metronomeIntervalRef.current) {
      clearInterval(metronomeIntervalRef.current);
      metronomeIntervalRef.current = null;
    }
    
    if (!audioContextRef.current) {
      audioContextRef.current = setupAudioContext();
    }
    
    const bpm = options.bpm || 60;
    const volume = (options.volume || 80) / 100;
    const intervalMs = (60 / bpm) * 1000;
    
    metronomeIntervalRef.current = window.setInterval(() => {
      createMetronomeSound(audioContextRef.current!, volume);
    }, intervalMs);
  }, [options.bpm, options.volume]);
  
  const stopMetronome = useCallback(() => {
    if (metronomeIntervalRef.current) {
      clearInterval(metronomeIntervalRef.current);
      metronomeIntervalRef.current = null;
    }
  }, []);
  
  // Play a keypress sound
  const playKeySound = useCallback((isCorrect: boolean, soundOptions: { volume?: number } = {}) => {
    if (!audioContextRef.current) {
      audioContextRef.current = setupAudioContext();
    }
    
    const volume = soundOptions.volume || 0.8;
    createKeySound(audioContextRef.current, isCorrect, volume);
  }, []);
  
  // Speak a letter using speech synthesis (with optional panning)
  const speakLetter = useCallback((letter: string, speakOptions: { 
    volume?: number, 
    pan?: number, 
    panningActive?: boolean,
    extremePanning?: boolean 
  } = {}) => {
    const volume = speakOptions.volume || 0.8;
    const pan = speakOptions.pan || 0;
    const panningActive = speakOptions.panningActive || false;
    const extremePanning = speakOptions.extremePanning || false;
    
    speakLetterWithSynthesis(letter, { 
      volume, 
      pan, 
      panningActive, 
      extremePanning 
    });
  }, []);
  
  // Play a tone for a letter with spatial positioning
  const playToneForLetter = useCallback((letter: string, toneOptions: {
    pan?: number, 
    volume?: number, 
    panningActive?: boolean,
    topRowPitch?: number,
    middleRowPitch?: number,
    bottomRowPitch?: number
  } = {}) => {
    const volume = toneOptions.volume || 0.8;
    const pan = toneOptions.pan || 0;
    const panningActive = toneOptions.panningActive || false;
    
    if (panningActive) {
      playPannedToneForLetter(letter, {
        pan,
        volume,
        topRowPitch: toneOptions.topRowPitch,
        middleRowPitch: toneOptions.middleRowPitch,
        bottomRowPitch: toneOptions.bottomRowPitch
      });
    }
  }, []);
  
  useEffect(() => {
    return () => {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
    };
  }, []);
  
  return {
    startMetronome,
    stopMetronome,
    playKeySound,
    speakLetter,
    playToneForLetter
  };
}
