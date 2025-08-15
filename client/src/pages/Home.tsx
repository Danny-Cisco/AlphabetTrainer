import TypingInterface from "@/components/TypingInterface";
import ControlPanel from "@/components/ControlPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Switch as SwitchComponent } from "@/components/ui/switch";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  const [panningActive, setPanningActive] = useState(false);
  const [keySoundsActive, setKeySoundsActive] = useState(false);
  const [volume, setVolume] = useState(80);
  
  // Pitch values for each keyboard row
  const [numberRowPitch, setNumberRowPitch] = useState(1000); // Highest pitch for number row
  const [topRowPitch, setTopRowPitch] = useState(750); // Higher pitch for top row
  const [middleRowPitch, setMiddleRowPitch] = useState(500); // Medium pitch for middle row
  const [bottomRowPitch, setBottomRowPitch] = useState(250); // Lower pitch for bottom row
  
  // Audio panning options
  const [extremePanning, setExtremePanning] = useState(false); // Disabled by default
  
  // Sequence options - White Belt default (alphabetical sequence)
  const [sequenceType, setSequenceType] = useState('alphabet'); // 'alphabet' or 'custom'
  
  // Character type options for custom sequences - White Belt default (letters only)
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeCommonPunctuation, setIncludeCommonPunctuation] = useState(false);
  const [includeExtendedPunctuation, setIncludeExtendedPunctuation] = useState(false);
  
  // Controls visibility
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [showAlphabetControls, setShowAlphabetControls] = useState(false);
  
  // Challenge modes - require additional key presses between characters
  const [challengeMode, setChallengeMode] = useState('none'); // 'none', 'space', 'delete', 'return', 'random'
  
  // Restart on fail - restarts sequence when user makes a mistake
  const [restartOnFail, setRestartOnFail] = useState(true);
  
  // Force sequence regeneration trigger
  const [sequenceKey, setSequenceKey] = useState(0);
  
  // BJJ Belt preset system
  const [beltPreset, setBeltPresetState] = useState<'white' | 'blue' | 'purple' | 'brown' | 'black'>('white');
  const [showBeltSelector, setShowBeltSelector] = useState(false);
  
  // Reactive handlers that trigger sequence regeneration
  const handleIncludeLettersChange = (include: boolean) => {
    setIncludeLetters(include);
    if (sequenceType === 'custom') {
      setSequenceKey(prev => prev + 1);
    }
  };
  
  const handleIncludeNumbersChange = (include: boolean) => {
    setIncludeNumbers(include);
    if (sequenceType === 'custom') {
      setSequenceKey(prev => prev + 1);
    }
  };
  
  const handleIncludeCommonPunctuationChange = (include: boolean) => {
    setIncludeCommonPunctuation(include);
    if (sequenceType === 'custom') {
      setSequenceKey(prev => prev + 1);
    }
  };
  
  const handleIncludeExtendedPunctuationChange = (include: boolean) => {
    setIncludeExtendedPunctuation(include);
    if (sequenceType === 'custom') {
      setSequenceKey(prev => prev + 1);
    }
  };

  // Belt preset handler
  const setBeltPreset = (belt: 'white' | 'blue' | 'purple' | 'brown' | 'black') => {
    setBeltPresetState(belt);
    
    switch (belt) {
      case 'white': // Beginner a-z mode (alphabetical sequence)
        setSequenceType('alphabet');
        setIncludeLetters(true);
        setIncludeNumbers(false);
        setIncludeCommonPunctuation(false);
        setIncludeExtendedPunctuation(false);
        break;
      case 'blue': // Random a-z mode
        setSequenceType('custom');
        setIncludeLetters(true);
        setIncludeNumbers(false);
        setIncludeCommonPunctuation(false);
        setIncludeExtendedPunctuation(false);
        break;
      case 'purple': // Random a-z mode with common punctuation
        setSequenceType('custom');
        setIncludeLetters(true);
        setIncludeNumbers(false);
        setIncludeCommonPunctuation(true);
        setIncludeExtendedPunctuation(false);
        break;
      case 'brown': // Random a-z mode with numbers and common punctuation
        setSequenceType('custom');
        setIncludeLetters(true);
        setIncludeNumbers(true);
        setIncludeCommonPunctuation(true);
        setIncludeExtendedPunctuation(false);
        break;
      case 'black': // Random a-z mode with numbers and all punctuation
        setSequenceType('custom');
        setIncludeLetters(true);
        setIncludeNumbers(true);
        setIncludeCommonPunctuation(true);
        setIncludeExtendedPunctuation(true);
        break;
    }
    
    // Force sequence regeneration
    setSequenceKey(prev => prev + 1);
  };

  // Reset function to restore all settings to defaults
  const handleReset = () => {
    // Reset all settings to their default values
    setPanningActive(false);
    setKeySoundsActive(false);
    setVolume(80);
    setNumberRowPitch(1000);
    setTopRowPitch(750);
    setMiddleRowPitch(500);
    setBottomRowPitch(250);
    setExtremePanning(false);
    setShowAudioControls(false);
    setShowAlphabetControls(false);
    setSequenceType('alphabet'); // White belt uses alphabetical sequence
    setIncludeLetters(true);
    setIncludeNumbers(false);
    setIncludeCommonPunctuation(false);
    setIncludeExtendedPunctuation(false);
    setChallengeMode('none');
    setRestartOnFail(true);
    
    // Reset belt to white belt and hide belt selector
    setBeltPresetState('white');
    setShowBeltSelector(false);
    
    // Force sequence regeneration
    setSequenceKey(prev => prev + 1);
  };

  return (
    <>
      <Helmet>
        <title>DigitDojo - Single Character Typing Practice</title>
        <meta name="description" content="Single character typing practice with advanced audio features to improve your typing speed and accuracy." />
      </Helmet>
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200 transition-colors">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">DigitDojo</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">Single Character Typing Practice</p>
              </div>
              <ThemeToggle />
            </div>
            
            {/* BJJ Belt Preset System */}
            <div className="text-center">
              {/* Current Belt Display */}
              <div className="mb-4">
                <h2 className={`text-5xl md:text-6xl font-bold mb-4 ${
                  beltPreset === 'white' ? 'text-gray-900 dark:text-gray-100' :
                  beltPreset === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                  beltPreset === 'purple' ? 'text-purple-700 dark:text-purple-300' :
                  beltPreset === 'brown' ? 'text-amber-700 dark:text-amber-300' :
                  'text-gray-900 dark:text-gray-100'
                }`}>
                  🥋 Lv {
                    beltPreset === 'white' ? '1. White Belt' :
                    beltPreset === 'blue' ? '2. Blue Belt' :
                    beltPreset === 'purple' ? '3. Purple Belt' :
                    beltPreset === 'brown' ? '4. Brown Belt' :
                    '5. Black Belt'
                  }
                </h2>
                <button
                  onClick={() => setShowBeltSelector(!showBeltSelector)}
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {showBeltSelector ? 'Hide Belt Selection' : 'Change Belt'}
                </button>
              </div>

              {/* Belt Selector (collapsible) */}
              {showBeltSelector && (
                <div className="flex flex-col gap-3 items-center max-w-xs mx-auto">
                  <button
                    onClick={() => {
                      setBeltPreset('white');
                      setShowBeltSelector(false);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  >
                    🥋 Lv 1. White Belt
                  </button>
                  <button
                    onClick={() => {
                      setBeltPreset('blue');
                      setShowBeltSelector(false);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                  >
                    🥋 Lv 2. Blue Belt
                  </button>
                  <button
                    onClick={() => {
                      setBeltPreset('purple');
                      setShowBeltSelector(false);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-700"
                  >
                    🥋 Lv 3. Purple Belt
                  </button>
                  <button
                    onClick={() => {
                      setBeltPreset('brown');
                      setShowBeltSelector(false);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
                  >
                    🥋 Lv 4. Brown Belt
                  </button>
                  <button
                    onClick={() => {
                      setBeltPreset('black');
                      setShowBeltSelector(false);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  >
                    🥋 Lv 5. Black Belt
                  </button>
                </div>
              )}
            </div>
          </header>

          <main>
            <TypingInterface 
              key={`typing-${sequenceKey}`}
              metronomeActive={false}
              speechActive={false}
              panningActive={panningActive}
              keySoundsActive={keySoundsActive}
              bpm={60}
              volume={volume}
              numberRowPitch={numberRowPitch}
              topRowPitch={topRowPitch}
              middleRowPitch={middleRowPitch}
              bottomRowPitch={bottomRowPitch}
              sequenceType={sequenceType}
              extremePanning={extremePanning}
              includeLetters={includeLetters}
              includeNumbers={includeNumbers}
              includeCommonPunctuation={includeCommonPunctuation}
              includeExtendedPunctuation={includeExtendedPunctuation}
              challengeMode={challengeMode}
              restartOnFail={restartOnFail}
              onReset={handleReset}
            />
            
            {/* Control Panel Toggle Buttons */}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setShowAlphabetControls(!showAlphabetControls)}
                className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium py-2 px-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center justify-center"
              >
                {showAlphabetControls ? (
                  <>
                    <ChevronUp className="w-5 h-5 mr-2" />
                    Hide Advanced Controls
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5 mr-2" />
                    Show Advanced Controls
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowAudioControls(!showAudioControls)}
                className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium py-2 px-4 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center justify-center"
              >
                {showAudioControls ? (
                  <>
                    <ChevronUp className="w-5 h-5 mr-2" />
                    Hide Audio Controls (Beta)
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5 mr-2" />
                    Show Audio Controls (Beta)
                  </>
                )}
              </button>
            </div>
            

            
            {/* Collapsible Alphabet Controls */}
            {showAlphabetControls && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                <ControlPanel 
                  panningActive={panningActive}
                  setPanningActive={setPanningActive}
                  keySoundsActive={keySoundsActive}
                  setKeySoundsActive={setKeySoundsActive}
                  volume={volume}
                  setVolume={setVolume}
                  numberRowPitch={numberRowPitch}
                  setNumberRowPitch={setNumberRowPitch}
                  topRowPitch={topRowPitch}
                  setTopRowPitch={setTopRowPitch}
                  middleRowPitch={middleRowPitch}
                  setMiddleRowPitch={setMiddleRowPitch}
                  bottomRowPitch={bottomRowPitch}
                  setBottomRowPitch={setBottomRowPitch}
                  sequenceType={sequenceType}
                  setSequenceType={setSequenceType}
                  extremePanning={extremePanning}
                  setExtremePanning={setExtremePanning}
                  includeLetters={includeLetters}
                  setIncludeLetters={handleIncludeLettersChange}
                  includeNumbers={includeNumbers}
                  setIncludeNumbers={handleIncludeNumbersChange}
                  includeCommonPunctuation={includeCommonPunctuation}
                  setIncludeCommonPunctuation={handleIncludeCommonPunctuationChange}
                  includeExtendedPunctuation={includeExtendedPunctuation}
                  setIncludeExtendedPunctuation={handleIncludeExtendedPunctuationChange}
                  challengeMode={challengeMode}
                  setChallengeMode={setChallengeMode}
                  restartOnFail={restartOnFail}
                  setRestartOnFail={setRestartOnFail}
                  showOnlyAlphabetControls={true}
                />
              </div>
            )}
            
            {/* Collapsible Audio Controls */}
            {showAudioControls && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                <ControlPanel 
                  panningActive={panningActive}
                  setPanningActive={setPanningActive}
                  keySoundsActive={keySoundsActive}
                  setKeySoundsActive={setKeySoundsActive}
                  volume={volume}
                  setVolume={setVolume}
                  numberRowPitch={numberRowPitch}
                  setNumberRowPitch={setNumberRowPitch}
                  topRowPitch={topRowPitch}
                  setTopRowPitch={setTopRowPitch}
                  middleRowPitch={middleRowPitch}
                  setMiddleRowPitch={setMiddleRowPitch}
                  bottomRowPitch={bottomRowPitch}
                  setBottomRowPitch={setBottomRowPitch}
                  sequenceType={sequenceType}
                  setSequenceType={setSequenceType}
                  extremePanning={extremePanning}
                  setExtremePanning={setExtremePanning}
                  includeLetters={includeLetters}
                  setIncludeLetters={handleIncludeLettersChange}
                  includeNumbers={includeNumbers}
                  setIncludeNumbers={handleIncludeNumbersChange}
                  includeCommonPunctuation={includeCommonPunctuation}
                  setIncludeCommonPunctuation={handleIncludeCommonPunctuationChange}
                  includeExtendedPunctuation={includeExtendedPunctuation}
                  setIncludeExtendedPunctuation={handleIncludeExtendedPunctuationChange}
                  showOnlyAudioControls={true}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
