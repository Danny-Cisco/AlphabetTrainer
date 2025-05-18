import { useState, useCallback, useEffect, useRef } from 'react';
import { useAudio } from './use-audio';

export function useTyping() {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const currentLetter = ALPHABET[currentLetterIndex];
  const letterDisplayRef = useRef<HTMLDivElement>(null);
  
  const { speakLetter, playKeySound } = useAudio({});
  
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
      
      // Play the appropriate sounds
      if (options.speechActive) {
        speakLetter(currentLetter, {
          pan: options.panningActive ? getPanValueForLetter(currentLetter) : 0,
          volume: options.volume / 100
        });
      }
      
      if (options.keySoundsActive) {
        playKeySound(true, { volume: options.volume / 100 });
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
  }, [currentLetter, speakLetter, playKeySound]);

  // Helper function to get a pan value based on keyboard position
  function getPanValueForLetter(letter: string): number {
    // Map QWERTY keyboard layout to pan values from -1 (left) to 1 (right)
    const keyboardRows = [
      'QWERTYUIOP',
      'ASDFGHJKL',
      'ZXCVBNM'
    ];
    
    for (const row of keyboardRows) {
      const index = row.indexOf(letter);
      if (index !== -1) {
        // Calculate pan value: -1 for leftmost, 1 for rightmost keys
        return -1 + (index * 2 / (row.length - 1));
      }
    }
    
    return 0; // Default to center if not found
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
