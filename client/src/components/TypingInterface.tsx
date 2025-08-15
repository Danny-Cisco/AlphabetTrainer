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
  restartOnFail: boolean;
  beltLevel: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  onReset: () => void;

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
  challengeMode,
  restartOnFail,
  beltLevel,
  onReset
}: TypingInterfaceProps) {

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [lockoutConfetti, setLockoutConfetti] = useState(false);

  // Function to get belt color for display
  const getBeltColor = (belt: 'white' | 'blue' | 'purple' | 'brown' | 'black') => {
    switch (belt) {
      case 'white': return 'bg-gray-100 border-gray-300';
      case 'blue': return 'bg-blue-500 border-blue-600';
      case 'purple': return 'bg-purple-500 border-purple-600';
      case 'brown': return 'bg-amber-600 border-amber-700';
      case 'black': return 'bg-gray-900 border-gray-700';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

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
    challengeMode: currentChallengeMode,
    bestProgress,
    resetAllStats,
    resetForBeltAdvancement,
    allAttempts,
    isWaitingToStart,
    startNewAttempt,
    getActiveSequence
  } = useTyping(sequenceType, {
    includeLetters,
    includeNumbers,
    includeCommonPunctuation,
    includeExtendedPunctuation
  }, challengeMode, restartOnFail, beltLevel);

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

  // Monitor for perfect scores and trigger confetti (no belt advancement)
  useEffect(() => {
    let shouldTriggerConfetti = false;
    
    if (lockoutConfetti) return; // Don't trigger if locked out
    
    if (restartOnFail && allAttempts.length > 0) {
      // In restart-on-fail mode, check allAttempts for completed attempts
      const latestAttempt = allAttempts[allAttempts.length - 1];
      if (latestAttempt.completed) {
        shouldTriggerConfetti = true;
      }
    } else if (sequenceAttempts.length > 0) {
      // In normal mode, check sequenceAttempts for perfect scores
      const latestAttempt = sequenceAttempts[sequenceAttempts.length - 1];
      if (latestAttempt.accuracy === 100) {
        shouldTriggerConfetti = true;
      }
    }
    
    if (shouldTriggerConfetti) {
      // Trigger confetti after a short delay to let the UI update
      setTimeout(() => {
        triggerConfetti();
        setLockoutConfetti(true); // Lock out confetti after triggering
      }, 300);
    }
  }, [sequenceAttempts, allAttempts, restartOnFail, lockoutConfetti]);

  // Unlock confetti when a new attempt is added to the array
  useEffect(() => {
    setLockoutConfetti(false); // Unlock when new attempts are added
  }, [restartOnFail ? allAttempts.length : sequenceAttempts.length]);

  // Function to trigger confetti celebration
  const triggerConfetti = () => {
    // Subtle confetti from corners with bigger pieces and rainbow colors
    const colors = [
      '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', 
      '#4B0082', '#9400D3', '#FF1493', '#00CED1', '#FFD700',
      '#FF6347', '#32CD32', '#8A2BE2', '#FF69B4', '#00FF7F'
    ];
    
    const particleCount = 50;
    
    // Left side confetti
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

    // Right side confetti with timing
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

    // Top corners
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

  // Focus the hidden input when the focus button is clicked
  const focusKeyboard = () => {
    resetCurrentStats(); // Reset stats when starting
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

  // Get sequence length based on sequence type - should match actual sequence
  const getSequenceLength = () => {
    return getActiveSequence().length;
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentLetterIndex) / (getSequenceLength() - 1)) * 100;

  return (
    <div className="typing-interface bg-white dark:bg-stone-950 rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300">
      {/* Start/Randomize Button Section - Moved to top */}
      <div className="bg-gray-100 dark:bg-amber-900 px-6 py-6 border-b border-gray-200 dark:border-amber-800">
        <div className="text-center">
          <div className="grid gap-3 justify-center grid-cols-3 max-w-2xl mx-auto">
            <button 
              onClick={focusKeyboard}
              className="bg-gray-200 dark:bg-amber-800 text-gray-900 dark:text-amber-100 font-medium py-4 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-amber-700 transition-colors flex items-center justify-center text-lg"
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
            
            {/* Randomize Button - Only show for custom sequence type */}
            {sequenceType === 'custom' ? (
              <button 
                onClick={() => {
                  resetForBeltAdvancement();
                  regenerateRandomSequence();
                  focusKeyboard();
                }}
                className="bg-gray-200 dark:bg-amber-800 text-gray-900 dark:text-amber-100 font-medium py-4 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-amber-700 transition-colors flex items-center justify-center text-lg whitespace-nowrap"
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
                Fresh Mix
              </button>
            ) : (
              <div></div>
            )}
            
            {/* Reset Button - Always show */}
            <button 
              onClick={() => {
                resetAllStats();
                regenerateRandomSequence();
                onReset();
                focusKeyboard();
              }}
              className="bg-gray-200 dark:bg-amber-800 text-gray-900 dark:text-amber-100 font-medium py-4 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-amber-700 transition-colors flex items-center justify-center text-lg"
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
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-6 pt-2 pb-0">
        {/* Current Letter Display or Press Space to Start */}
        <div className="text-center mb-8">
          {isWaitingToStart ? (
            <div className="h-48 flex flex-col items-center justify-center">
              {!isFocused ? (
                <>
                  <div className="text-4xl font-bold text-gray-600 dark:text-amber-100 mb-4" style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 300 }}>
                    Press Start to Capture Keyboard
                  </div>

                </>
              ) : allAttempts.length > 0 ? (
                <>
                  {/* Show stats from the last attempt */}
                  {(() => {
                    const lastAttempt = allAttempts[allAttempts.length - 1];
                    return (
                      <>
                        <div className="text-4xl font-bold text-gray-600 dark:text-amber-100 mb-4" style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 300 }}>
                          Press Space to Start
                        </div>
                        <div className="text-3xl font-mono font-bold mb-2">
                          <span className={lastAttempt.completed ? "text-green-500 dark:text-green-400" : "text-gray-700 dark:text-amber-100"}>
                            {lastAttempt.progress}/{lastAttempt.sequenceLength}
                          </span>
                        </div>
                        {lastAttempt.cps && (
                          <div className="text-2xl font-mono text-gray-600 dark:text-amber-100">
                            {lastAttempt.cps.toFixed(2)} cps
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : (
                <>
                  <div className="text-4xl font-bold text-gray-600 dark:text-amber-100 mb-4" style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 300 }}>
                    Press Space to Start
                  </div>
                  <div className="text-lg text-gray-500 dark:text-amber-100" style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 300 }}>
                    Get ready to type the sequence
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-9xl font-bold text-blue-500 dark:text-amber-100 mb-4 h-48 flex items-center justify-center" style={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 500 }}>
              {currentLetter === ' ' ? (
                <Space size={120} className="text-blue-500 dark:text-amber-100" />
              ) : currentLetter === 'Backspace' ? (
                <Delete size={120} className="text-blue-500 dark:text-amber-100" />
              ) : currentLetter === 'Enter' ? (
                <CornerDownLeft size={120} className="text-blue-500 dark:text-amber-100" />
              ) : (
                currentLetter
              )}
            </div>
          )}
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-amber-900 rounded-full h-2.5 mb-6">
            <div 
              className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          

          
          {/* Character Progress Counter */}
          <div className="text-center mb-6">
            <p className="text-2xl font-mono text-gray-700 dark:text-amber-100" style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 400 }}>
              {currentLetterIndex}/{getSequenceLength()}
            </p>
            <p className="text-sm text-gray-500 dark:text-amber-100" style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 300 }}>
              characters
            </p>
          </div>
          

          
          {/* All Attempts History - show when restart on fail is enabled and there are attempts */}
          {restartOnFail && allAttempts.length > 0 && (
            <div className="mt-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Attempt History</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {allAttempts.length} attempt{allAttempts.length === 1 ? '' : 's'} • Best: {bestProgress}/{getSequenceLength()}
                    {allAttempts.some(a => a.cps) && (
                      <>
                        {' • '}Average: {(
                          allAttempts
                            .filter(a => a.cps && a.progress > 0)
                            .reduce((sum, a) => sum + (a.cps || 0), 0) /
                          Math.max(1, allAttempts.filter(a => a.cps && a.progress > 0).length)
                        ).toFixed(2)} cps
                      </>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => resetAllStats()}
                  className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded transition-colors"
                >
                  Clear History
                </button>
              </div>
              
              {/* Visual progress bars for each attempt */}
              <div className="space-y-1">
                {allAttempts.slice(-10).map((attempt, index) => (
                  <div key={attempt.timestamp} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 ${getBeltColor(attempt.beltLevel)}`}></div>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 relative">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          attempt.progress === bestProgress 
                            ? 'bg-green-500 dark:bg-green-400' 
                            : attempt.progress === 0
                            ? 'bg-red-500 dark:bg-red-400'
                            : 'bg-blue-500 dark:bg-blue-400'
                        }`}
                        style={{ width: `${Math.max(2, (attempt.progress / attempt.sequenceLength) * 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 min-w-[140px] justify-end">
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-4 text-right">
                        {attempt.progress}
                      </span>
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-400">/</span>
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-6">
                        {attempt.sequenceLength}
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-20 text-right">
                        {attempt.cps && attempt.progress > 0 ? `${attempt.cps.toFixed(2)} cps` : '0.00 cps'}
                      </span>
                      <span className="text-xs w-4 text-center">
                        {attempt.progress === 0 && '💀'}
                        {attempt.progress === bestProgress && attempt.progress > 0 && '🎯'}
                        {attempt.completed && '✓'}
                        {attempt.progress > 0 && !attempt.completed && attempt.progress !== bestProgress && ' '}
                      </span>
                    </div>
                  </div>
                ))}
                {allAttempts.length > 10 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-1">
                    Showing last 10 of {allAttempts.length} attempts
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Sequence Attempts History - only show when NOT in restart mode */}
          {!restartOnFail && sequenceAttempts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-amber-100 mb-3">Recent Attempts</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {sequenceAttempts.slice(-5).reverse().map((attempt, index) => (
                  <div key={index} className={`rounded p-3 flex justify-between items-center text-sm ${
                    attempt.accuracy === 100 
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400' 
                      : 'bg-gray-50 dark:bg-amber-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-amber-100">{attempt.sequenceType}</span>
                      {attempt.accuracy === 100 && (
                        <div className="flex items-center gap-1">
                          <span className="text-lg">🏆</span>
                          <span className="text-blue-700 dark:text-blue-300 font-bold text-xs" style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 600 }}>PERFECT!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-600 dark:text-green-400">{attempt.correct} characters</span>
                      <span className="text-red-600 dark:text-red-400">{attempt.errors} errors</span>
                      <span className={`font-semibold ${attempt.accuracy === 100 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-amber-100'}`}>
                        {attempt.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Hidden input for keyboard capture */}
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
      </div>
    </div>
  );
}
