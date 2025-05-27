import { Toggle } from "@/components/ui/toggle";

interface ControlPanelProps {
  panningActive: boolean;
  setPanningActive: (active: boolean) => void;
  keySoundsActive: boolean;
  setKeySoundsActive: (active: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  numberRowPitch: number;
  setNumberRowPitch: (pitch: number) => void;
  topRowPitch: number;
  setTopRowPitch: (pitch: number) => void;
  middleRowPitch: number;
  setMiddleRowPitch: (pitch: number) => void;
  bottomRowPitch: number;
  setBottomRowPitch: (pitch: number) => void;
  sequenceType: string;
  setSequenceType: (type: string) => void;
  extremePanning: boolean;
  setExtremePanning: (extreme: boolean) => void;
  includeLetters: boolean;
  setIncludeLetters: (include: boolean) => void;
  includeNumbers: boolean;
  setIncludeNumbers: (include: boolean) => void;
  includeCommonPunctuation: boolean;
  setIncludeCommonPunctuation: (include: boolean) => void;
  includeExtendedPunctuation: boolean;
  setIncludeExtendedPunctuation: (include: boolean) => void;
}

export default function ControlPanel({
  panningActive,
  setPanningActive,
  keySoundsActive,
  setKeySoundsActive,
  volume,
  setVolume,
  numberRowPitch,
  setNumberRowPitch,
  topRowPitch,
  setTopRowPitch,
  middleRowPitch,
  setMiddleRowPitch,
  bottomRowPitch,
  setBottomRowPitch,
  sequenceType,
  setSequenceType,
  extremePanning,
  setExtremePanning,
  includeLetters,
  setIncludeLetters,
  includeNumbers,
  setIncludeNumbers,
  includeCommonPunctuation,
  setIncludeCommonPunctuation,
  includeExtendedPunctuation,
  setIncludeExtendedPunctuation
}: ControlPanelProps) {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value, 10));
  };
  
  // Handlers for pitch sliders
  const handleNumberRowPitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberRowPitch(parseFloat(e.target.value));
  };
  
  const handleTopRowPitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopRowPitch(parseFloat(e.target.value));
  };
  
  const handleMiddleRowPitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMiddleRowPitch(parseFloat(e.target.value));
  };
  
  const handleBottomRowPitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBottomRowPitch(parseFloat(e.target.value));
  };

  // Handle sequence type selection
  const handleSequenceChange = (type: string) => {
    setSequenceType(type);
  };

  // Generate new random sequence for custom mix
  const generateNewSequence = () => {
    // Force re-render by temporarily switching types
    setSequenceType('alphabet');
    setTimeout(() => setSequenceType('custom'), 10);
  };

  return (
    <div className="space-y-6">
      {/* Type Sequence Panel */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Type Sequence
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Alphabet sequence */}
            <button
              onClick={() => handleSequenceChange('alphabet')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                sequenceType === 'alphabet'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700 mb-1">Alphabet</div>
                <div className="text-sm text-gray-500">A-Z sequence</div>
              </div>
            </button>

            {/* Random sequence */}
            <button
              onClick={() => handleSequenceChange('random')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                sequenceType === 'random'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700 mb-1">Random</div>
                <div className="text-sm text-gray-500">Shuffled A-Z</div>
              </div>
            </button>

            {/* Custom mix */}
            <button
              onClick={() => handleSequenceChange('custom')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                sequenceType === 'custom'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700 mb-1">Custom Mix</div>
                <div className="text-sm text-gray-500">Choose character types</div>
              </div>
            </button>
          </div>

          {/* Custom Mix Options */}
          {sequenceType === 'custom' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Character Types:</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeLetters}
                    onChange={(e) => setIncludeLetters(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Letters (A-Z)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Numbers (0-9)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeCommonPunctuation}
                    onChange={(e) => setIncludeCommonPunctuation(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Common punctuation</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeExtendedPunctuation}
                    onChange={(e) => setIncludeExtendedPunctuation(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Extended punctuation</span>
                </label>
              </div>
              <button
                onClick={generateNewSequence}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Random Sequence
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Audio Controls Panel */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polygon points="11 5,6 9,2 9,2 15,6 15,11 19,11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            Audio Controls
          </h2>
        </div>
        <div className="p-6">
          {/* Audio Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Key Sounds Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Toggle
                  pressed={keySoundsActive}
                  onPressedChange={setKeySoundsActive}
                  aria-label="Toggle key sounds"
                  className="mr-3 data-[state=on]:bg-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Enable Key Sounds</label>
              </div>
            </div>

            {/* Spatial Audio Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Toggle
                  pressed={panningActive}
                  onPressedChange={setPanningActive}
                  aria-label="Toggle spatial audio"
                  className="mr-3 data-[state=on]:bg-green-500"
                />
                <label className="text-sm font-medium text-gray-700">Enable Spatial Audio</label>
              </div>
            </div>
          </div>

          {/* Volume Control */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="volume" className="text-sm font-medium text-gray-700">
                Volume
              </label>
              <span className="text-sm font-mono">{volume}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
              id="volume"
            />
          </div>

          {/* Panning Mode Selection */}
          {panningActive && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Spatial Audio Mode</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="panningMode"
                    checked={!extremePanning}
                    onChange={() => setExtremePanning(false)}
                    className="mr-2"
                  />
                  <span className="text-sm">Natural (Gradual panning)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="panningMode"
                    checked={extremePanning}
                    onChange={() => setExtremePanning(true)}
                    className="mr-2"
                  />
                  <span className="text-sm">Extreme (100% L/R)</span>
                </label>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-xs text-blue-700">
                    Spatial audio pans sounds left/right based on keyboard hand position. Use headphones for best experience.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Show pitch sliders when tone generator is active */}
          {keySoundsActive && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Keyboard Row Pitch Settings</h3>
              
              {/* Number row pitch slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="number-row-pitch" className="text-xs text-gray-600">
                    Number Row (1234567890!@#$%^&*()`~-_=+)
                  </label>
                  <span className="text-xs font-mono">{Math.round(numberRowPitch)} Hz</span>
                </div>
                <input 
                  type="range" 
                  min="800" 
                  max="1200" 
                  step="1"
                  value={numberRowPitch} 
                  onChange={handleNumberRowPitchChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  id="number-row-pitch"
                />
              </div>
              
              {/* Top row pitch slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="top-row-pitch" className="text-xs text-gray-600">
                    Top Row (QWERTYUIOP)
                  </label>
                  <span className="text-xs font-mono">{Math.round(topRowPitch)} Hz</span>
                </div>
                <input 
                  type="range" 
                  min="400" 
                  max="800" 
                  step="1"
                  value={topRowPitch} 
                  onChange={handleTopRowPitchChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  id="top-row-pitch"
                />
              </div>
              
              {/* Middle row pitch slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="middle-row-pitch" className="text-xs text-gray-600">
                    Middle Row (ASDFGHJKL)
                  </label>
                  <span className="text-xs font-mono">{Math.round(middleRowPitch)} Hz</span>
                </div>
                <input 
                  type="range" 
                  min="300" 
                  max="600" 
                  step="1"
                  value={middleRowPitch} 
                  onChange={handleMiddleRowPitchChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  id="middle-row-pitch"
                />
              </div>
              
              {/* Bottom row pitch slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="bottom-row-pitch" className="text-xs text-gray-600">
                    Bottom Row (ZXCVBNM)
                  </label>
                  <span className="text-xs font-mono">{Math.round(bottomRowPitch)} Hz</span>
                </div>
                <input 
                  type="range" 
                  min="200" 
                  max="400" 
                  step="1"
                  value={bottomRowPitch} 
                  onChange={handleBottomRowPitchChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  id="bottom-row-pitch"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}