import { useState, useCallback, useEffect, useRef } from 'react';
import { useAudio } from './use-audio';

interface CharacterOptions {
  includeLetters: boolean;
  includeNumbers: boolean;
  includeCommonPunctuation: boolean;
  includeExtendedPunctuation: boolean;
}

export function useTyping(sequenceType = 'alphabet', characterOptions?: CharacterOptions, challengeMode = 'none', restartOnFail = false) {
  // Different character sets
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NUMBERS = '0123456789';
  const COMMON_PUNCTUATION = ',.?!-();:\'"';
  const EXTENDED_PUNCTUATION = '@#$%^&*+=[]{}|\\~`_/<>';
  
  const REVERSE_ALPHABET = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
  
  // Generate a custom character set based on user selections
  const generateCustomCharacterSet = () => {
    if (!characterOptions) return ALPHABET;
    
    let characters = '';
    if (characterOptions.includeLetters) characters += ALPHABET;
    if (characterOptions.includeNumbers) characters += NUMBERS;
    if (characterOptions.includeCommonPunctuation) characters += COMMON_PUNCTUATION;
    if (characterOptions.includeExtendedPunctuation) characters += EXTENDED_PUNCTUATION;
    
    // If nothing is selected, default to letters
    if (characters === '') characters = ALPHABET;
    
    return characters;
  };
  
  // Generate a random sequence from the selected character set
  const generateRandomSequence = () => {
    const characterSet = sequenceType === 'custom' ? generateCustomCharacterSet() : ALPHABET;
    const characters = characterSet.split('');
    
    // Fisher-Yates shuffle algorithm
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    return characters.join('');
  };
  
  // Initial random sequence
  const [randomSequence, setRandomSequence] = useState(generateRandomSequence());
  
  // Get the active sequence based on selection
  const getActiveSequence = () => {
    switch(sequenceType) {
      case 'reverse': return REVERSE_ALPHABET;
      case 'custom': return randomSequence;
      default: return ALPHABET;
    }
  };
  
  // Function to reset current attempt stats
  const resetCurrentStats = () => {
    setCurrentLetterIndex(0);
    setCurrentCorrectCount(0);
    setCurrentErrorCount(0);
    setAwaitingChallengeKey(false);
    setCurrentChallengeKey('');
  };

  // Function to reset everything including progress tracking
  const resetAllStats = () => {
    resetCurrentStats();
    setBestProgress(0);
    setAllAttempts([]);
    setIsWaitingToStart(true);
    setAttemptStartTime(null);
  };

  // Function to start a new attempt
  const startNewAttempt = () => {
    setIsWaitingToStart(false);
    setAttemptStartTime(Date.now());
    resetCurrentStats();
  };

  // Function to generate a new random sequence
  const regenerateRandomSequence = () => {
    resetCurrentStats();
    setRandomSequence(generateRandomSequence());
  };

  // Reset stats when sequence type, character options, or challenge mode change
  useEffect(() => {
    resetAllStats();
    if (sequenceType === 'custom') {
      setRandomSequence(generateRandomSequence());
    }
  }, [sequenceType, characterOptions?.includeLetters, characterOptions?.includeNumbers, characterOptions?.includeCommonPunctuation, characterOptions?.includeExtendedPunctuation, challengeMode]);
  
  // Sequence attempt tracking
  interface SequenceAttempt {
    correct: number;
    errors: number;
    accuracy: number;
    sequenceType: string;
    completed: boolean;
    cps?: number;
  }

  interface AttemptHistory {
    progress: number;
    timestamp: number;
    completed: boolean;
    cps?: number;
  }

  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentCorrectCount, setCurrentCorrectCount] = useState(0);
  const [currentErrorCount, setCurrentErrorCount] = useState(0);
  const [sequenceAttempts, setSequenceAttempts] = useState<SequenceAttempt[]>([]);
  const [bestProgress, setBestProgress] = useState(0);
  const [allAttempts, setAllAttempts] = useState<AttemptHistory[]>([]);
  const [isWaitingToStart, setIsWaitingToStart] = useState(true);
  const [attemptStartTime, setAttemptStartTime] = useState<number | null>(null);
  
  // Current sequence stats
  const currentAccuracy = currentCorrectCount + currentErrorCount > 0 
    ? Math.round((currentCorrectCount / (currentCorrectCount + currentErrorCount)) * 100)
    : 100;
  
  // Challenge mode state
  const [awaitingChallengeKey, setAwaitingChallengeKey] = useState(false);
  const [currentChallengeKey, setCurrentChallengeKey] = useState<string>('');
  
  // Get the current sequence and letter
  const activeSequence = getActiveSequence();
  const baseSequence = activeSequence;
  
  // Determine what we're expecting next
  let currentLetter: string;
  if (challengeMode === 'none') {
    currentLetter = baseSequence[currentLetterIndex] || '';
  } else if (awaitingChallengeKey) {
    currentLetter = currentChallengeKey;
  } else {
    // For challenge modes, we need the actual letter index
    // Letters are at positions: 0, 2, 4, 6... (even indices)
    // Challenge keys are at positions: 1, 3, 5, 7... (odd indices)
    const letterIndex = Math.floor(currentLetterIndex / 2);
    currentLetter = baseSequence[letterIndex] || '';
  }
  
  const letterDisplayRef = useRef<HTMLDivElement>(null);
  
  const { speakLetter, playKeySound, playToneForLetter } = useAudio({});
  
  // Function to get the required challenge key
  const getChallengeKey = () => {
    switch (challengeMode) {
      case 'space': return ' ';
      case 'delete': return 'Backspace';
      case 'return': return 'Enter';
      case 'random': 
        const randomKeys = [' ', 'Backspace', 'Enter'];
        return randomKeys[Math.floor(Math.random() * randomKeys.length)];
      default: return '';
    }
  };
  
  // Function to complete current sequence and add to history
  const completeSequence = (finalCorrectCount?: number, finalErrorCount?: number) => {
    const correctCount = finalCorrectCount ?? currentCorrectCount;
    const errorCount = finalErrorCount ?? currentErrorCount;
    const totalAttempts = correctCount + errorCount;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
    
    // Calculate characters per second if we have a start time
    let cps: number | undefined;
    if (attemptStartTime) {
      const totalTime = (Date.now() - attemptStartTime) / 1000; // Convert to seconds
      // correctCount already includes all keystrokes (letters + challenge keys in challenge mode)
      cps = correctCount / totalTime;
    }

    // Record the completed attempt
    const sequenceLength = getActiveSequence().length;
    setAllAttempts(prev => [...prev, { 
      progress: sequenceLength, 
      timestamp: Date.now(), 
      completed: true,
      cps 
    }]);

    // Update best progress
    if (sequenceLength > bestProgress) {
      setBestProgress(sequenceLength);
    }
    
    // Only add to legacy sequence attempts if not in restart mode
    if (!restartOnFail) {
      const newAttempt: SequenceAttempt = {
        correct: correctCount,
        errors: errorCount,
        accuracy: accuracy,
        sequenceType: sequenceType,
        completed: true
      };
      
      setSequenceAttempts(prev => [...prev, newAttempt]);
    }
    
    // Set waiting to start for next attempt
    setIsWaitingToStart(true);
    setAttemptStartTime(null);
    
    // Reset for new sequence (but keep the same sequence)
    setCurrentLetterIndex(0);
    setCurrentCorrectCount(0);
    setCurrentErrorCount(0);
    
    // Don't auto-generate new sequence - let user manually randomize when they want
  };

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
    numberRowPitch?: number;
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
    const keyPressed = keyQueueRef.current.shift()!;
    let keyToCheck: string;
    

    
    // Handle special keys properly (Mac and PC compatibility)
    if (keyPressed === ' ') {
      keyToCheck = ' ';
    } else if (keyPressed === 'Enter' || keyPressed === 'Return') {
      keyToCheck = 'Enter';
    } else if (keyPressed === 'Backspace' || keyPressed === 'Delete') {
      keyToCheck = 'Backspace';
    } else {
      keyToCheck = keyPressed.toUpperCase();
    }
    
    if (keyToCheck === currentLetter) {
      // Correct key press
      setCurrentCorrectCount(prev => prev + 1);
      
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
          pan: options.panningActive ? getPanValueForLetter(currentLetter, options.extremePanning) : 0,
          volume: options.volume / 100,
          panningActive: options.panningActive,
          topRowPitch: options.topRowPitch || 750,
          middleRowPitch: options.middleRowPitch || 500,
          bottomRowPitch: options.bottomRowPitch || 250
        });
      }
      
      // Handle challenge mode progression
      if (challengeMode !== 'none') {
        if (awaitingChallengeKey) {
          // Just completed a challenge key, move to next letter
          setAwaitingChallengeKey(false);
          setCurrentChallengeKey('');
          
          // Move to next letter after completing challenge key
          const nextIndex = currentLetterIndex + 1;
          setCurrentLetterIndex(nextIndex);
          
          // In challenge mode, check if we've typed all the letters
          // Each letter has index: 0, 2, 4, 6... (even numbers)
          // Each challenge key has index: 1, 3, 5, 7... (odd numbers)
          const lettersCompleted = Math.ceil(nextIndex / 2);
          if (lettersCompleted >= baseSequence.length) {
            setTimeout(() => completeSequence(currentCorrectCount + 1, currentErrorCount), 100);
          }
        } else {
          // Just completed a letter, now need challenge key
          setAwaitingChallengeKey(true);
          setCurrentChallengeKey(getChallengeKey());
          
          // Increment by 1 to move to challenge key position
          setCurrentLetterIndex(prev => prev + 1);
        }
      } else {
        // Normal mode - move to next letter
        const nextIndex = currentLetterIndex + 1;
        setCurrentLetterIndex(nextIndex);
        
        // Check if sequence is complete
        if (nextIndex >= getActiveSequence().length) {
          setTimeout(() => completeSequence(currentCorrectCount + 1, currentErrorCount), 100);
        }
      }
      
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
      setCurrentErrorCount(prev => prev + 1);
      
      // Animate the letter element (in red)
      if (letterDisplayRef.current) {
        letterDisplayRef.current.classList.add('text-red-500');
        letterDisplayRef.current.classList.remove('text-blue-500', 'text-green-500');
      }
      
      if (options.keySoundsActive) {
        playKeySound(false, { volume: options.volume / 100 });
      }
      
      // Check if restart on fail is enabled
      if (restartOnFail) {
        // Track progress - how many characters were typed correctly
        const currentProgress = challengeMode === 'none' 
          ? currentLetterIndex 
          : Math.floor(currentLetterIndex / 2);
        
        // Calculate characters per second if we have a start time
        let cps: number | undefined;
        if (attemptStartTime && currentProgress > 0) {
          const totalTime = (Date.now() - attemptStartTime) / 1000;
          // Use the current correct count which already includes all keystrokes
          cps = currentCorrectCount / totalTime;
        }
        
        // Record this attempt in the history
        setAllAttempts(prev => [...prev, { 
          progress: currentProgress, 
          timestamp: Date.now(), 
          completed: false,
          cps 
        }]);
        
        // Update best progress if this attempt got further
        if (currentProgress > bestProgress) {
          setBestProgress(currentProgress);
        }
        
        // Enhanced visual feedback - make the whole interface briefly flash red
        const interfaceElement = letterDisplayRef.current?.closest('.typing-interface');
        if (interfaceElement) {
          interfaceElement.classList.add('bg-red-100', 'dark:bg-red-900');
        }
        
        // Reset the sequence immediately on error
        setTimeout(() => {
          setIsWaitingToStart(true);
          setAttemptStartTime(null);
          resetCurrentStats();
          if (letterDisplayRef.current) {
            letterDisplayRef.current.classList.remove('text-red-500');
            letterDisplayRef.current.classList.add('text-blue-500');
          }
          // Remove the red background flash
          if (interfaceElement) {
            interfaceElement.classList.remove('bg-red-100', 'dark:bg-red-900');
          }
          // Clear any pending keystrokes
          keyQueueRef.current = [];
          setIsProcessingKey(false);
        }, 500); // Longer delay to show the error clearly
      } else {
        // Normal behavior - reset after brief delay
        setTimeout(() => {
          if (letterDisplayRef.current) {
            letterDisplayRef.current.classList.remove('text-red-500');
            letterDisplayRef.current.classList.add('text-blue-500');
          }
          
          // Process the next key in the queue if it exists
          processNextKey(options);
        }, 100); // Reduced delay for faster typing response
      }
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
    // If waiting to start, only accept space key
    if (isWaitingToStart) {
      if (key === ' ') {
        startNewAttempt();
      }
      return;
    }
    
    // Process printable characters and special keys needed for challenge modes
    const allowedSpecialKeys = ['Backspace', 'Enter', 'Delete', 'Return'];
    if (key.length !== 1 && !allowedSpecialKeys.includes(key)) return;
    
    // Add key to the queue
    keyQueueRef.current.push(key);
    
    // If we're not currently processing a key, start processing
    if (!isProcessingKey) {
      setIsProcessingKey(true);
      processNextKey(options);
    }
  }, [isProcessingKey, processNextKey, isWaitingToStart, startNewAttempt]);

  // Helper function to get a pan value based on keyboard position
  function getPanValueForLetter(letter: string, extremePanning: boolean = false): number {
    // Map QWERTY keyboard layout to pan values
    // Standard touch typing hand positions:
    // Left hand: Q, W, E, R, T, A, S, D, F, G, Z, X, C, V, B
    // Right hand: Y, U, I, O, P, H, J, K, L, N, M
    
    // Special handling for 6^ (left speaker) and 7& (right speaker)
    if (letter === '6' || letter === '^') {
      return -1.0; // Full left
    }
    if (letter === '7' || letter === '&') {
      return 1.0; // Full right
    }
    
    // For natural panning (gradual left to right):
    const naturalPanValues = {
      // Letters
      'Q': -1.0,  'W': -0.8,  'E': -0.6,  'R': -0.4,  'T': -0.2,  'Y': 0.2,   'U': 0.4,   'I': 0.6,   'O': 0.8,   'P': 1.0,
      'A': -0.9,  'S': -0.7,  'D': -0.5,  'F': -0.3,  'G': -0.1,  'H': 0.1,   'J': 0.3,   'K': 0.5,   'L': 0.7,
      'Z': -0.8,  'X': -0.6,  'C': -0.4,  'V': -0.2,  'B': 0.0,   'N': 0.2,   'M': 0.4,
      
      // Numbers (left to right across keyboard)
      '1': -1.0,  '2': -0.8,  '3': -0.6,  '4': -0.4,  '5': -0.2,  '8': 0.4,   '9': 0.6,   '0': 0.8,
      
      // Number row punctuation and symbols
      '!': -1.0,  '@': -0.8,  '#': -0.6,  '$': -0.4,  '%': -0.2,  '*': 0.4,   '(': 0.6,   ')': 0.8,
      '`': -1.0,  '~': -1.0,  '-': 0.8,   '_': 0.8,   '=': 0.8,   '+': 0.8,
      
      // Top row punctuation
      '[': 1.0,   ']': 1.0,   '{': 1.0,   '}': 1.0,   '\\': 1.0,  '|': 1.0,
      
      // Middle row punctuation
      ';': 0.7,   "'": 0.7,   ':': 0.7,   '"': 0.7,
      
      // Bottom row punctuation
      ',': 0.2,   '.': 0.4,   '/': 0.6,   '<': 0.2,   '>': 0.4,   '?': 0.6
    };
    
    // For extreme panning (full left/right separation):
    const leftHandKeys = ['Q', 'W', 'E', 'R', 'T', 'A', 'S', 'D', 'F', 'G', 'Z', 'X', 'C', 'V', 'B',
                          '1', '2', '3', '4', '5', '!', '@', '#', '$', '%', '`', '~'];
    
    // Uppercase the letter for consistency
    const upperLetter = letter.toUpperCase();
    
    if (extremePanning) {
      // Return -1 (full left) for left hand keys, 1 (full right) for right hand keys
      return leftHandKeys.includes(upperLetter) || leftHandKeys.includes(letter) ? -1.0 : 1.0;
    } else {
      // Return gradual panning based on keyboard position
      return naturalPanValues[upperLetter as keyof typeof naturalPanValues] || 
             naturalPanValues[letter as keyof typeof naturalPanValues] || 0;
    }
  }
  
  return {
    currentLetter,
    currentLetterIndex,
    correctCount: currentCorrectCount,
    errorCount: currentErrorCount,
    accuracy: currentAccuracy,
    sequenceAttempts,
    handleKeyPress,
    letterDisplayRef,
    regenerateRandomSequence,
    resetCurrentStats,
    awaitingChallengeKey,
    challengeMode,
    bestProgress,
    resetAllStats,
    allAttempts,
    isWaitingToStart,
    startNewAttempt,
    getActiveSequence
  };
}
