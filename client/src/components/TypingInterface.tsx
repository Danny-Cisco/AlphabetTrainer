import { useEffect, useRef, useState } from "react";
import { useTyping } from "@/hooks/use-typing";
import { useAudio } from "@/hooks/use-audio";
import { Space, Delete, CornerDownLeft } from "lucide-react";
import confetti from "canvas-confetti";

interface TypingInterfaceProps {
  metronomeActive: boolean;
  speechActive: boolean;
  panningActive: boolean;
  keySoundsActive: boolean;
  bpm: number;
  volume: number;
  numberRowPitch?: number;
  topRowPitch?: number;
  middleRowPitch?: number;
  bottomRowPitch?: number;
  sequenceType: string;
  extremePanning: boolean;
  includeLetters: boolean;
  includeNumbers: boolean;
  includeCommonPunctuation: boolean;
  includeExtendedPunctuation: boolean;
  challengeMode: string;
}

export default function TypingInterface({
  metronomeActive,
  speechActive,
  panningActive,
  keySoundsActive,
  bpm,
  volume,
  numberRowPitch,
  topRowPitch,
  middleRowPitch,
  bottomRowPitch,
  sequenceType,
  extremePanning,
  includeLetters,
  includeNumbers,
  includeCommonPunctuation,
  includeExtendedPunctuation,
  challengeMode
}: TypingInterfaceProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Set up typing logic
  const {
    currentLetter,
    currentLetterIndex,
    correctCount,
    errorCount,
    accuracy,
    sequenceAttempts,
    handleKeyPress,
    letterDisplayRef,
    regenerateRandomSequence,
    resetCurrentStats,
    awaitingChallengeKey,
    challengeMode: currentChallengeMode
  } = useTyping(sequenceType, {
    includeLetters,
    includeNumbers,
    includeCommonPunctuation,
    includeExtendedPunctuation
  }, challengeMode);

  // Set up audio features
  const { startMetronome, stopMetronome } = useAudio({
    bpm,
    volume,
    metronomeActive,
    speechActive,
    panningActive,
    keySoundsActive
  });

  // Handle the metronome toggle
  useEffect(() => {
    if (metronomeActive) {
      startMetronome();
    } else {
      stopMetronome();
    }
    
    return () => stopMetronome();
  }, [metronomeActive, bpm, startMetronome, stopMetronome]);

  // Monitor for perfect scores and trigger confetti
  useEffect(() => {
    if (sequenceAttempts.length > 0) {
      const latestAttempt = sequenceAttempts[sequenceAttempts.length - 1];
      if (latestAttempt.accuracy === 100) {
        // Trigger confetti after a short delay to let the UI update
        setTimeout(triggerConfetti, 300);
      }
    }
  }, [sequenceAttempts]);

  // Focus the hidden input when the focus button is clicked
  const focusKeyboard = () => {
    resetCurrentStats(); // Reset stats when starting
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Function to trigger confetti celebration
  const triggerConfetti = () => {
    // Subtle confetti from corners with bigger pieces and rainbow colors
    const particleCount = 50;
    const colors = [
      '#FF0000', // Red
      '#FF7F00', // Orange
      '#FFFF00', // Yellow
      '#00FF00', // Green
      '#0000FF', // Blue
      '#4B0082', // Indigo
      '#9400D3', // Violet
      '#FF1493', // Deep Pink
      '#00CED1', // Dark Turquoise
      '#FFD700', // Gold
      '#FF6347', // Tomato
      '#32CD32', // Lime Green
      '#8A2BE2', // Blue Violet
      '#FF69B4', // Hot Pink
      '#00FF7F'  // Spring Green
    ];

    // Left side confetti with bigger pieces
    confetti({
      particleCount,
      spread: 60,
      origin: { x: 0, y: 0.8 },
      angle: 60,
      colors,
      startVelocity: 35,
      gravity: 0.8,
      scalar: 1.8
    });

    // Right side confetti with bigger pieces
    setTimeout(() => {
      confetti({
        particleCount,
        spread: 60,
        origin: { x: 1, y: 0.8 },
        angle: 120,
        colors,
        startVelocity: 35,
        gravity: 0.8,
        scalar: 1.8
      });
    }, 150);

    // Top corners with bigger pieces
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { x: 0.1, y: 0.1 },
        angle: 45,
        colors,
        startVelocity: 25,
        gravity: 0.6,
        scalar: 1.5
      });
      
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { x: 0.9, y: 0.1 },
        angle: 135,
        colors,
        startVelocity: 25,
        gravity: 0.6,
        scalar: 1.5
      });
    }, 300);
  };

  // Handle key press and audio feedback
  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyPress(e.key, {
      speechActive,
      panningActive,
      keySoundsActive,
      volume,
      numberRowPitch,
      topRowPitch,
      middleRowPitch,
      bottomRowPitch,
      extremePanning
    });
  };

  // Get sequence length based on sequence type
  const getSequenceLength = () => {
    if (sequenceType === 'custom') {
      // Calculate based on selected character types
      let length = 0;
      if (includeLetters) length += 26;
      if (includeNumbers) length += 10;
      if (includeCommonPunctuation) length += 12;
      if (includeExtendedPunctuation) length += 18;
      return length || 26; // Default to 26 if nothing selected
    }
    return 26; // Standard alphabet sequences
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentLetterIndex) / (getSequenceLength() - 1)) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6">
        {/* Current Letter Display */}
        <div className="text-center mb-8">
          <div className="text-9xl font-mono font-bold text-blue-500 dark:text-blue-400 mb-4 h-48 flex items-center justify-center">
            {currentLetter === ' ' ? (
              <Space size={120} className="text-blue-500 dark:text-blue-400" />
            ) : currentLetter === 'Backspace' ? (
              <Delete size={120} className="text-blue-500 dark:text-blue-400" />
            ) : currentLetter === 'Enter' ? (
              <CornerDownLeft size={120} className="text-blue-500 dark:text-blue-400" />
            ) : (
              currentLetter
            )}
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
            <div 
              className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Letter progress - different for each sequence type */}
          <div className="flex justify-between font-mono text-xs text-gray-500 dark:text-gray-400 mb-8">
            {sequenceType === 'alphabet' && (
              <>
                <span>A</span>
                <span>D</span>
                <span>H</span>
                <span>L</span>
                <span>P</span>
                <span>T</span>
                <span>Z</span>
              </>
            )}
            {sequenceType === 'reverse' && (
              <>
                <span>Z</span>
                <span>T</span>
                <span>P</span>
                <span>L</span>
                <span>H</span>
                <span>D</span>
                <span>A</span>
              </>
            )}
            {sequenceType === 'custom' && (
              <>
                <span>Custom</span>
                <span>mix</span>
                <span>of</span>
                <span>characters</span>
              </>
            )}
          </div>
          
          {/* Instructions - dynamic based on sequence type */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {sequenceType === 'alphabet' && "Type the letter shown above. Progress through A-Z."}
            {sequenceType === 'reverse' && "Type the letter shown above. Progress through Z-A."}
            {sequenceType === 'custom' && "Type the character shown above. Progress through your custom character mix."}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Characters</p>
              <p className="text-2xl font-mono font-semibold text-green-500 dark:text-green-400">{correctCount}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Errors</p>
              <p className="text-2xl font-mono font-semibold text-red-500 dark:text-red-400">{errorCount}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy</p>
              <p className="text-2xl font-mono font-semibold text-gray-800 dark:text-gray-200">{accuracy}%</p>
            </div>
          </div>
          
          {/* Sequence Attempts History */}
          {sequenceAttempts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Attempts</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {sequenceAttempts.slice(-5).reverse().map((attempt, index) => (
                  <div key={index} className={`rounded p-3 flex justify-between items-center text-sm ${
                    attempt.accuracy === 100 
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400' 
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">{attempt.sequenceType}</span>
                      {attempt.accuracy === 100 && (
                        <div className="flex items-center gap-1">
                          <span className="text-lg">🏆</span>
                          <span className="text-blue-700 dark:text-blue-300 font-bold text-xs">PERFECT!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-600 dark:text-green-400">{attempt.correct} characters</span>
                      <span className="text-red-600 dark:text-red-400">{attempt.errors} errors</span>
                      <span className={`font-semibold ${attempt.accuracy === 100 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {attempt.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Keyboard Focus Area */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {isFocused 
                ? "Keyboard ready! Type the letter shown above." 
                : "Start typing or press any key to begin"}
            </p>
            <input 
              ref={hiddenInputRef}
              type="text" 
              className="sr-only" 
              aria-hidden="true"
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            <div className={`grid gap-3 justify-center ${sequenceType === 'custom' ? 'grid-cols-2' : 'grid-cols-1'} max-w-xs mx-auto`}>
              <button 
                onClick={focusKeyboard}
                className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium py-3 px-6 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center justify-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="inline-block mr-2 h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <line x1="6" y1="10" x2="6" y2="10" />
                  <line x1="10" y1="10" x2="10" y2="10" />
                  <line x1="14" y1="10" x2="14" y2="10" />
                  <line x1="18" y1="10" x2="18" y2="10" />
                  <line x1="6" y1="14" x2="6" y2="14" />
                  <line x1="10" y1="14" x2="10" y2="14" />
                  <line x1="14" y1="14" x2="14" y2="14" />
                  <line x1="18" y1="14" x2="18" y2="14" />
                </svg>
                Start
              </button>
              
              {/* New Random Sequence Button - Only show for custom sequence type */}
              {sequenceType === 'custom' && (
                <button 
                  onClick={() => {
                    regenerateRandomSequence();
                    focusKeyboard();
                  }}
                  className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium py-3 px-6 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center justify-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="inline-block mr-2 h-5 w-5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                  Randomize
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
