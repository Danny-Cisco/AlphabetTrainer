import TypingInterface from "@/components/TypingInterface";
import ControlPanel from "@/components/ControlPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  const [panningActive, setPanningActive] = useState(true);
  const [keySoundsActive, setKeySoundsActive] = useState(true);
  const [volume, setVolume] = useState(80);
  
  // Pitch values for each keyboard row
  const [numberRowPitch, setNumberRowPitch] = useState(1000); // Highest pitch for number row
  const [topRowPitch, setTopRowPitch] = useState(750); // Higher pitch for top row
  const [middleRowPitch, setMiddleRowPitch] = useState(500); // Medium pitch for middle row
  const [bottomRowPitch, setBottomRowPitch] = useState(250); // Lower pitch for bottom row
  
  // Audio panning options
  const [extremePanning, setExtremePanning] = useState(true); // Use extreme (100% L/R) panning by default
  
  // Sequence options
  const [sequenceType, setSequenceType] = useState('custom'); // 'alphabet', 'reverse', or 'custom'
  
  // Character type options for custom sequences
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeCommonPunctuation, setIncludeCommonPunctuation] = useState(false);
  const [includeExtendedPunctuation, setIncludeExtendedPunctuation] = useState(false);
  
  // Controls visibility
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [showAlphabetControls, setShowAlphabetControls] = useState(false);
  
  // Force sequence regeneration trigger
  const [sequenceKey, setSequenceKey] = useState(0);
  
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

  return (
    <>
      <Helmet>
        <title>TypeTone - Alphabet Typing Practice</title>
        <meta name="description" content="Simple alphabet typing practice with metronome and audio feedback features to enhance your typing skills." />
      </Helmet>
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200 transition-colors">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <header className="mb-8 flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">TypeTone</h1>
              <p className="text-gray-600 dark:text-gray-400">Simple alphabet typing practice with audio feedback</p>
            </div>
            <ThemeToggle />
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
                    Hide Alphabet Controls
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5 mr-2" />
                    Show Alphabet Controls
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
                    Hide Audio Controls
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5 mr-2" />
                    Show Audio Controls
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
          
          <footer className="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>TypeTone - Alphabet Typing Practice with Audio Feedback</p>
          </footer>
        </div>
      </div>
    </>
  );
}
