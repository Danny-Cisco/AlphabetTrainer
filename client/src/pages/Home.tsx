import TypingInterface from "@/components/TypingInterface";
import ControlPanel from "@/components/ControlPanel";
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
  
  // Audio controls visibility
  const [showAudioControls, setShowAudioControls] = useState(false);

  return (
    <>
      <Helmet>
        <title>TypeTone - Alphabet Typing Practice</title>
        <meta name="description" content="Simple alphabet typing practice with metronome and audio feedback features to enhance your typing skills." />
      </Helmet>
      
      <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-blue-600">TypeTone</h1>
            <p className="text-gray-600">Simple alphabet typing practice with audio feedback</p>
          </header>

          <main>
            <TypingInterface 
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
            
            {/* Audio Controls Toggle */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAudioControls(!showAudioControls)}
                className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center mx-auto"
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
                  setIncludeLetters={setIncludeLetters}
                  includeNumbers={includeNumbers}
                  setIncludeNumbers={setIncludeNumbers}
                  includeCommonPunctuation={includeCommonPunctuation}
                  setIncludeCommonPunctuation={setIncludeCommonPunctuation}
                  includeExtendedPunctuation={includeExtendedPunctuation}
                  setIncludeExtendedPunctuation={setIncludeExtendedPunctuation}
                />
              </div>
            )}
          </main>
          
          <footer className="mt-10 text-center text-gray-500 text-sm">
            <p>TypeTone - Alphabet Typing Practice with Audio Feedback</p>
          </footer>
        </div>
      </div>
    </>
  );
}
