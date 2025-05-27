import { useEffect, useRef, useState } from "react";
import { useTyping } from "@/hooks/use-typing";
import { useAudio } from "@/hooks/use-audio";

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
  includeExtendedPunctuation
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
    handleKeyPress,
    regenerateRandomSequence
  } = useTyping(sequenceType, {
    includeLetters,
    includeNumbers,
    includeCommonPunctuation,
    includeExtendedPunctuation
  });

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

  // Focus the hidden input when the focus button is clicked
  const focusKeyboard = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Handle key press and audio feedback
  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyPress(e.key, {
      speechActive,
      panningActive,
      keySoundsActive,
      volume,
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6">
        {/* Current Letter Display */}
        <div className="text-center mb-8">
          <div className="text-9xl font-mono font-bold text-blue-500 mb-4 h-48 flex items-center justify-center">
            {currentLetter}
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Letter progress - different for each sequence type */}
          <div className="flex justify-between font-mono text-xs text-gray-500 mb-8">
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
          <p className="text-gray-600 mb-6">
            {sequenceType === 'alphabet' && "Type the letter shown above. Progress through A-Z."}
            {sequenceType === 'reverse' && "Type the letter shown above. Progress through Z-A."}
            {sequenceType === 'custom' && "Type the character shown above. Progress through your custom character mix."}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-2">
            <div className="bg-gray-50 rounded p-3">
              <p className="text-xs text-gray-500">Current Letter</p>
              <p className="text-2xl font-mono font-semibold">{currentLetter}</p>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-xs text-gray-500">Correct</p>
              <p className="text-2xl font-mono font-semibold text-green-500">{correctCount}</p>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-xs text-gray-500">Errors</p>
              <p className="text-2xl font-mono font-semibold text-red-500">{errorCount}</p>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-xs text-gray-500">Accuracy</p>
              <p className="text-2xl font-mono font-semibold">{accuracy}%</p>
            </div>
          </div>
        </div>
        
        {/* Keyboard Focus Area */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-gray-100 px-4 py-3 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">
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
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={focusKeyboard}
                className="bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="inline-block mr-1 h-5 w-5" 
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
                Focus Keyboard
              </button>
              
              {/* New Random Sequence Button - Only show for custom sequence type */}
              {sequenceType === 'custom' && (
                <button 
                  onClick={() => {
                    regenerateRandomSequence();
                    focusKeyboard();
                  }}
                  className="bg-green-100 text-green-700 font-medium py-2 px-4 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="inline-block mr-1 h-5 w-5" 
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
                  New Character Mix
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
