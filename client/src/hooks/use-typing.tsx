import { useState, useCallback, useEffect, useRef } from 'react';
import { useAudio } from './use-audio';

export function useTyping(sequenceType = 'alphabet') {
  // Different sequences to practice with
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const REVERSE_ALPHABET = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
  
  // Generate a random sequence of 26 letters (A-Z shuffled)
  const generateRandomSequence = () => {
    const letters = ALPHABET.split('');
    // Fisher-Yates shuffle algorithm
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };
  
  // Initial random sequence
  const [randomSequence, setRandomSequence] = useState(generateRandomSequence());
  
  // Get the active sequence based on selection
  const getActiveSequence = () => {
    switch(sequenceType) {
      case 'reverse': return REVERSE_ALPHABET;
      case 'random': return randomSequence;
      default: return ALPHABET;
    }
  };
  
  // Function to generate a new random sequence
  const regenerateRandomSequence = () => {
    setCurrentLetterIndex(0);
    setCorrectCount(0);
    setErrorCount(0);
    setRandomSequence(generateRandomSequence());
  };
  
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  
  // Get the current sequence and letter
  const activeSequence = getActiveSequence();
  const currentLetter = activeSequence[currentLetterIndex];
  
  const letterDisplayRef = useRef<HTMLDivElement>(null);
  
  const { speakLetter, playKeySound, playToneForLetter } = useAudio({});
  
  // Calculate accuracy whenever correct or error counts change
  useEffect(() => {
    const total = correctCount + errorCount;
    if (total === 0) {
      setAccuracy(100);
    } else {
      setAccuracy(Math.round((correctCount / total) * 100));
    }
  }, [correctCount, errorCount]);

  // Flag to track if we're currently processing a key
  const [isProcessingKey, setIsProcessingKey] = useState(false);
  // Queue for storing pending keystrokes
  const keyQueueRef = useRef<string[]>([]);
  
  // Process the next key in the queue
  const processNextKey = useCallback((options: {
    speechActive: boolean;
    panningActive: boolean;
    keySoundsActive: boolean;
    volume: number;
    topRowPitch?: number;
    middleRowPitch?: number;
    bottomRowPitch?: number;
    extremePanning?: boolean;
  }) => {
    if (keyQueueRef.current.length === 0) {
      setIsProcessingKey(false);
      return;
    }
    
    // Get the next key from the queue
    const keyPressed = keyQueueRef.current.shift()!.toUpperCase();
    
    if (keyPressed === currentLetter) {
      // Correct key press
      setCorrectCount(prev => prev + 1);
      
      // Animate the letter element (in green)
      if (letterDisplayRef.current) {
        letterDisplayRef.current.classList.add('text-green-500');
        letterDisplayRef.current.classList.remove('text-blue-500', 'text-red-500');
      }
      
      // Play the voice if speech is active
      if (options.speechActive) {
        speakLetter(currentLetter, {
          volume: options.volume / 100,
          pan: options.panningActive ? getPanValueForLetter(currentLetter, options.extremePanning) : 0,
          extremePanning: options.extremePanning
        });
      }
      
      // Play the spatial tones if key sounds are active
      if (options.keySoundsActive) {
        playToneForLetter(currentLetter, {
          pan: options.panningActive ? getPanValueForLetter(currentLetter, options.extremePanning) : 0,
          volume: options.volume / 100,
          panningActive: options.panningActive,
          topRowPitch: options.topRowPitch || 587.33,
          middleRowPitch: options.middleRowPitch || 440,
          bottomRowPitch: options.bottomRowPitch || 329.63
        });
      }
      
      // Advance to next letter immediately
      setCurrentLetterIndex((prevIndex) => (prevIndex + 1) % getActiveSequence().length);
      
      // Reset the letter color after a short delay for visual feedback
      setTimeout(() => {
        if (letterDisplayRef.current) {
          letterDisplayRef.current.classList.remove('text-green-500');
          letterDisplayRef.current.classList.add('text-blue-500');
        }
        
        // Process the next key in the queue if it exists
        processNextKey(options);
      }, 100); // Reduced delay for faster typing response
    } else {
      // Incorrect key press
      setErrorCount(prev => prev + 1);
      
      // Animate the letter element (in red)
      if (letterDisplayRef.current) {
        letterDisplayRef.current.classList.add('text-red-500');
        letterDisplayRef.current.classList.remove('text-blue-500', 'text-green-500');
      }
      
      if (options.keySoundsActive) {
        playKeySound(false, { volume: options.volume / 100 });
      }
      
      // Reset after brief delay
      setTimeout(() => {
        if (letterDisplayRef.current) {
          letterDisplayRef.current.classList.remove('text-red-500');
          letterDisplayRef.current.classList.add('text-blue-500');
        }
        
        // Process the next key in the queue if it exists
        processNextKey(options);
      }, 100); // Reduced delay for faster typing response
    }
  }, [currentLetter, speakLetter, playKeySound, playToneForLetter]);
  
  // Handle key press with audio feedback options
  const handleKeyPress = useCallback((key: string, options: {
    speechActive: boolean;
    panningActive: boolean;
    keySoundsActive: boolean;
    volume: number;
    topRowPitch?: number;
    middleRowPitch?: number;
    bottomRowPitch?: number;
    extremePanning?: boolean;
  }) => {
    // Only process alphabetical keys
    if (!/^[a-zA-Z]$/.test(key)) return;
    
    // Add key to the queue
    keyQueueRef.current.push(key);
    
    // If we're not currently processing a key, start processing
    if (!isProcessingKey) {
      setIsProcessingKey(true);
      processNextKey(options);
    }
  }, [isProcessingKey, processNextKey]);

  // Helper function to get a pan value based on keyboard position
  function getPanValueForLetter(letter: string, extremePanning: boolean = false): number {
    // Map QWERTY keyboard layout to pan values
    // Standard touch typing hand positions:
    // Left hand: Q, W, E, R, T, A, S, D, F, G, Z, X, C, V, B
    // Right hand: Y, U, I, O, P, H, J, K, L, N, M
    
    // For natural panning (gradual left to right):
    const naturalPanValues = {
      'Q': -1.0,  'W': -0.8,  'E': -0.6,  'R': -0.4,  'T': -0.2,  'Y': 0.2,   'U': 0.4,   'I': 0.6,   'O': 0.8,   'P': 1.0,
      'A': -0.9,  'S': -0.7,  'D': -0.5,  'F': -0.3,  'G': -0.1,  'H': 0.1,   'J': 0.3,   'K': 0.5,   'L': 0.7,
      'Z': -0.8,  'X': -0.6,  'C': -0.4,  'V': -0.2,  'B': 0.0,   'N': 0.2,   'M': 0.4
    };
    
    // For extreme panning (full left/right separation):
    const leftHandKeys = ['Q', 'W', 'E', 'R', 'T', 'A', 'S', 'D', 'F', 'G', 'Z', 'X', 'C', 'V', 'B'];
    
    // Uppercase the letter for consistency
    const upperLetter = letter.toUpperCase();
    
    if (extremePanning) {
      // Return -1 (full left) for left hand keys, 1 (full right) for right hand keys
      return leftHandKeys.includes(upperLetter) ? -1.0 : 1.0;
    } else {
      // Return gradual panning based on keyboard position
      return naturalPanValues[upperLetter as keyof typeof naturalPanValues] || 0;
    }
  }
  
  return {
    currentLetter,
    currentLetterIndex,
    correctCount,
    errorCount,
    accuracy,
    handleKeyPress,
    letterDisplayRef,
    regenerateRandomSequence
  };
}
