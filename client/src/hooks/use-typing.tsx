import { useState, useCallback, useEffect, useRef } from 'react';
import { useAudio } from './use-audio';

export function useTyping(sequenceType = 'alphabet') {
  // Different sequences to practice with
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const REVERSE_ALPHABET = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
  const QUICK_BROWN_FOX = 'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG';
  
  // Get the active sequence based on selection
  const getActiveSequence = () => {
    switch(sequenceType) {
      case 'reverse': return REVERSE_ALPHABET;
      case 'fox': return QUICK_BROWN_FOX;
      default: return ALPHABET;
    }
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

  // Handle key press with audio feedback options
  const handleKeyPress = useCallback((key: string, options: {
    speechActive: boolean;
    panningActive: boolean;
    keySoundsActive: boolean;
    volume: number;
    topRowPitch?: number;
    middleRowPitch?: number;
    bottomRowPitch?: number;
  }) => {
    // Only process alphabetical keys
    if (!/^[a-zA-Z]$/.test(key)) return;
    
    const keyPressed = key.toUpperCase();
    
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
          volume: options.volume / 100
        });
      }
      
      // Play the spatial tones if key sounds are active
      if (options.keySoundsActive) {
        playToneForLetter(currentLetter, {
          pan: options.panningActive ? getPanValueForLetter(currentLetter) : 0,
          volume: options.volume / 100,
          panningActive: options.panningActive,
          topRowPitch: options.topRowPitch || 587.33,
          middleRowPitch: options.middleRowPitch || 440,
          bottomRowPitch: options.bottomRowPitch || 329.63
        });
      }
      
      // Advance to next letter after a brief delay
      setTimeout(() => {
        setCurrentLetterIndex((prevIndex) => (prevIndex + 1) % ALPHABET.length);
        
        // Reset the letter color
        if (letterDisplayRef.current) {
          letterDisplayRef.current.classList.remove('text-green-500');
          letterDisplayRef.current.classList.add('text-blue-500');
        }
      }, 200);
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
      }, 200);
    }
  }, [currentLetter, speakLetter, playKeySound, playToneForLetter]);

  // Helper function to get a pan value based on keyboard position
  function getPanValueForLetter(letter: string): number {
    // Map QWERTY keyboard layout to pan values from -1 (left) to 1 (right)
    const keyboardLayout = {
      'Q': -1.0,  'W': -0.8,  'E': -0.6,  'R': -0.4,  'T': -0.2,  'Y': 0.2,   'U': 0.4,   'I': 0.6,   'O': 0.8,   'P': 1.0,
      'A': -0.9,  'S': -0.7,  'D': -0.5,  'F': -0.3,  'G': -0.1,  'H': 0.1,   'J': 0.3,   'K': 0.5,   'L': 0.7,
      'Z': -0.8,  'X': -0.6,  'C': -0.4,  'V': -0.2,  'B': 0.0,   'N': 0.2,   'M': 0.4
    };
    
    // Uppercase the letter for consistency
    const upperLetter = letter.toUpperCase();
    
    // Return the pan value if it exists in our layout, otherwise default to center (0)
    return keyboardLayout[upperLetter as keyof typeof keyboardLayout] || 0;
  }
  
  return {
    currentLetter,
    currentLetterIndex,
    correctCount,
    errorCount,
    accuracy,
    handleKeyPress,
    letterDisplayRef
  };
}
