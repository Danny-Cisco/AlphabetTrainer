import TypingInterface from "@/components/TypingInterface";
import ControlPanel from "@/components/ControlPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Switch as SwitchComponent } from "@/components/ui/switch";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { ChevronDown, ChevronUp } from "lucide-react";
import dojoBg from "@/assets/dojo-bg1.jpg";

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
  
  const belts = [
    { id: 'white', name: '1. White Belt', color: 'text-gray-900 dark:text-gray-100', tagline: 'Beginner A-Z mode' },
    { id: 'blue', name: '2. Blue Belt', color: 'text-blue-700 dark:text-blue-300', tagline: 'Random A-Z mode' },
    { id: 'purple', name: '3. Purple Belt', color: 'text-purple-700 dark:text-purple-300', tagline: 'Random A-Z mode with common punctuation' },
    { id: 'brown', name: '4. Brown Belt', color: 'text-amber-700 dark:text-amber-300', tagline: 'Random A-Z mode with numbers and common punctuation' },
    { id: 'black', name: '5. Black Belt', color: 'text-gray-900 dark:text-gray-100', tagline: 'Random A-Z mode with numbers and advanced punctuation' }
  ] as const;
  
  const currentBeltIndex = belts.findIndex(belt => belt.id === beltPreset);
  
  const navigateBelt = (direction: 'prev' | 'next') => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentBeltIndex === 0 ? belts.length - 1 : currentBeltIndex - 1;
    } else {
      newIndex = currentBeltIndex === belts.length - 1 ? 0 : currentBeltIndex + 1;
    }
    setBeltPreset(belts[newIndex].id as 'white' | 'blue' | 'purple' | 'brown' | 'black');
  };
  
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
  const setBeltPreset = (belt: 'white' | 'blue' | 'purple' | 'brown' | 'black', forceSequenceRegen = true) => {
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
    
    // Only force sequence regeneration if explicitly requested
    if (forceSequenceRegen) {
      setSequenceKey(prev => prev + 1);
    }
  };

  // Belt advancement handler (for automatic advancement)
  const handleBeltAdvancement = () => {
    const currentIndex = belts.findIndex(belt => belt.id === beltPreset);
    // Don't advance if already at black belt
    if (currentIndex < belts.length - 1) {
      const nextBelt = belts[currentIndex + 1];
      // Delay the belt advancement by 5 seconds to allow user to see stats
      setTimeout(() => {
        // Force sequence regeneration to reset typing state for new belt
        setBeltPreset(nextBelt.id as 'white' | 'blue' | 'purple' | 'brown' | 'black', true);
      }, 5000);
    }
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
    
    // Reset belt to white belt
    setBeltPresetState('white');
    
    // Force sequence regeneration
    setSequenceKey(prev => prev + 1);
  };

  return (
    <>
      <Helmet>
        <title>DigitDojo - Single Character Typing Practice</title>
        <meta name="description" content="Single character typing practice with advanced audio features to improve your typing speed and accuracy." />
      </Helmet>
      
      <div 
        className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200 transition-colors relative"
        style={{
          backgroundImage: `url(${dojoBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/60"></div>
        
        <div className="container max-w-4xl mx-auto px-4 py-8 relative z-10">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 300 }}>DigitDojo</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1" style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 300 }}>Single Character Typing Practice</p>
              </div>
              <ThemeToggle />
            </div>
            
            {/* BJJ Belt Preset System - Carousel Style */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-6">
                {/* Previous Belt Button */}
                <button
                  onClick={() => navigateBelt('prev')}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 p-3 rounded-full transition-colors"
                  aria-label="Previous belt"
                >
                  <ChevronDown className="w-6 h-6 rotate-90" />
                </button>
                
                {/* Current Belt Display */}
                <div className="min-w-0 flex-1 max-w-lg">
                  <h2 className={`text-5xl md:text-6xl ${belts[currentBeltIndex].color}`} style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 300 }}>
                    🥋 {belts[currentBeltIndex].name}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2" style={{ fontFamily: 'Mozilla Headline, sans-serif', fontWeight: 300 }}>
                    {belts[currentBeltIndex].tagline}
                  </p>
                </div>
                
                {/* Next Belt Button */}
                <button
                  onClick={() => navigateBelt('next')}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 p-3 rounded-full transition-colors"
                  aria-label="Next belt"
                >
                  <ChevronDown className="w-6 h-6 -rotate-90" />
                </button>
              </div>
              
              {/* Belt Progress Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {belts.map((belt, index) => (
                  <button
                    key={belt.id}
                    onClick={() => setBeltPreset(belt.id as 'white' | 'blue' | 'purple' | 'brown' | 'black')}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentBeltIndex 
                        ? 'bg-gray-600 dark:bg-gray-300' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Select ${belt.name}`}
                  />
                ))}
              </div>
            </div>
          </header>

          <main>
            <div className={`rounded-lg p-6 transition-colors ${
              beltPreset === 'white' ? 'bg-white dark:bg-white text-gray-900 dark:text-gray-900' :
              beltPreset === 'blue' ? 'bg-blue-600 dark:bg-blue-700 text-white' :
              beltPreset === 'purple' ? 'bg-purple-600 dark:bg-purple-700 text-white' :
              beltPreset === 'brown' ? 'bg-amber-700 dark:bg-amber-800 text-white' :
              'bg-gray-900 dark:bg-black text-white'
            }`}>
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
              onBeltAdvancement={handleBeltAdvancement}
            />
            </div>
            
            {/* Control Panel Toggle Buttons */}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setShowAlphabetControls(!showAlphabetControls)}
                className="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center justify-center"
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
                className="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center justify-center"
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
