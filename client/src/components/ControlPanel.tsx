import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  challengeMode?: string;
  setChallengeMode?: (mode: string) => void;
  restartOnFail?: boolean;
  setRestartOnFail?: (restart: boolean) => void;
  showOnlyAlphabetControls?: boolean;
  showOnlyAudioControls?: boolean;
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
  setIncludeExtendedPunctuation,
  challengeMode,
  setChallengeMode,
  restartOnFail,
  setRestartOnFail,
  showOnlyAlphabetControls = false,
  showOnlyAudioControls = false
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
      {/* Alphabet Controls Panel */}
      {(!showOnlyAudioControls) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
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
            Advanced Controls
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Alphabet sequence */}
            <button
              onClick={() => handleSequenceChange('alphabet')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                sequenceType === 'alphabet'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Beginner</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">A-Z sequence</div>
              </div>
            </button>



            {/* Custom mix */}
            <button
              onClick={() => handleSequenceChange('custom')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                sequenceType === 'custom'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Custom Mix</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Choose character types</div>
              </div>
            </button>
          </div>

          {/* Custom Mix Options */}
          {sequenceType === 'custom' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Character Types:</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="letters"
                    checked={includeLetters}
                    onCheckedChange={setIncludeLetters}
                  />
                  <Label htmlFor="letters" className="text-sm text-gray-700 dark:text-gray-300">Letters (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={setIncludeNumbers}
                  />
                  <Label htmlFor="numbers" className="text-sm text-gray-700 dark:text-gray-300">Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="common-punctuation"
                    checked={includeCommonPunctuation}
                    onCheckedChange={setIncludeCommonPunctuation}
                  />
                  <Label htmlFor="common-punctuation" className="text-sm text-gray-700 dark:text-gray-300">Common punctuation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="extended-punctuation"
                    checked={includeExtendedPunctuation}
                    onCheckedChange={setIncludeExtendedPunctuation}
                  />
                  <Label htmlFor="extended-punctuation" className="text-sm text-gray-700 dark:text-gray-300">Advanced Punctuation</Label>
                </div>
              </div>

              {/* Challenge Modes - only show in advanced controls */}
              {showOnlyAlphabetControls && challengeMode !== undefined && setChallengeMode && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Challenge Modes:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setChallengeMode('space')}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors text-sm ${
                        challengeMode === 'space'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Space Between
                    </button>
                    
                    <button
                      onClick={() => setChallengeMode('delete')}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors text-sm ${
                        challengeMode === 'delete'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Delete Between
                    </button>
                    
                    <button
                      onClick={() => setChallengeMode('return')}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors text-sm ${
                        challengeMode === 'return'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Return Between
                    </button>
                    
                    <button
                      onClick={() => setChallengeMode('random')}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors text-sm ${
                        challengeMode === 'random'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Random Between
                    </button>
                  </div>
                  
                  {challengeMode !== 'none' && (
                    <button
                      onClick={() => setChallengeMode('none')}
                      className="mt-3 w-full py-2 px-4 rounded-lg font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm"
                    >
                      Disable Challenge Mode
                    </button>
                  )}
                </div>
              )}

              {/* Restart on Fail Setting - only show in advanced controls */}
              {showOnlyAlphabetControls && restartOnFail !== undefined && setRestartOnFail && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Settings:</h3>
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Restart on Fail</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Automatically restart sequence when you make a mistake</p>
                    </div>
                    <Switch
                      checked={restartOnFail}
                      onCheckedChange={setRestartOnFail}
                    />
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
        </div>
      )}

      {/* Audio Controls Panel */}
      {(!showOnlyAlphabetControls) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
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
                <Switch
                  checked={keySoundsActive}
                  onCheckedChange={setKeySoundsActive}
                  className="mr-3"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Key Sounds</label>
              </div>
            </div>

            {/* Spatial Audio Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Switch
                  checked={panningActive}
                  onCheckedChange={setPanningActive}
                  className="mr-3"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Spatial Audio</label>
              </div>
            </div>
          </div>

          {/* Volume Control */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="volume" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Volume
              </label>
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{volume}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Panning Mode Selection */}
          {panningActive && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Spatial Audio Mode</h3>
              <RadioGroup
                value={extremePanning ? "extreme" : "natural"}
                onValueChange={(value) => setExtremePanning(value === "extreme")}
                className="flex items-center gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="natural" id="natural" />
                  <Label htmlFor="natural" className="text-sm text-gray-700 dark:text-gray-300">Natural (Gradual panning)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extreme" id="extreme" />
                  <Label htmlFor="extreme" className="text-sm text-gray-700 dark:text-gray-300">Extreme (100% L/R)</Label>
                </div>
              </RadioGroup>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    Spatial audio pans sounds left/right based on keyboard hand position. Use headphones for best experience.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Show pitch sliders when tone generator is active */}
          {keySoundsActive && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Keyboard Row Pitch Settings</h3>
              
              {/* Number row pitch slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="number-row-pitch" className="text-xs text-gray-600 dark:text-gray-300">
                    Number Row (1234567890!@#$%^&*()`~-_=+)
                  </label>
                  <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{Math.round(numberRowPitch)} Hz</span>
                </div>
                <Slider
                  value={[numberRowPitch]}
                  onValueChange={(value) => setNumberRowPitch(value[0])}
                  min={800}
                  max={1200}
                  step={1}
                  className="w-full"
                />
              </div>
              
              {/* Top row pitch slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="top-row-pitch" className="text-xs text-gray-600 dark:text-gray-300">
                    Top Row (QWERTYUIOP)
                  </label>
                  <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{Math.round(topRowPitch)} Hz</span>
                </div>
                <Slider
                  value={[topRowPitch]}
                  onValueChange={(value) => setTopRowPitch(value[0])}
                  min={400}
                  max={800}
                  step={1}
                  className="w-full"
                />
              </div>
              
              {/* Middle row pitch slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="middle-row-pitch" className="text-xs text-gray-600 dark:text-gray-300">
                    Middle Row (ASDFGHJKL)
                  </label>
                  <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{Math.round(middleRowPitch)} Hz</span>
                </div>
                <Slider
                  value={[middleRowPitch]}
                  onValueChange={(value) => setMiddleRowPitch(value[0])}
                  min={300}
                  max={600}
                  step={1}
                  className="w-full"
                />
              </div>
              
              {/* Bottom row pitch slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="bottom-row-pitch" className="text-xs text-gray-600 dark:text-gray-300">
                    Bottom Row (ZXCVBNM)
                  </label>
                  <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{Math.round(bottomRowPitch)} Hz</span>
                </div>
                <Slider
                  value={[bottomRowPitch]}
                  onValueChange={(value) => setBottomRowPitch(value[0])}
                  min={200}
                  max={400}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
}