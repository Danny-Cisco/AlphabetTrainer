import { Toggle } from "@/components/ui/toggle";

interface ControlPanelProps {
  metronomeActive: boolean;
  setMetronomeActive: (active: boolean) => void;
  speechActive: boolean;
  setSpeechActive: (active: boolean) => void;
  panningActive: boolean;
  setPanningActive: (active: boolean) => void;
  keySoundsActive: boolean;
  setKeySoundsActive: (active: boolean) => void;
  bpm: number;
  setBpm: (bpm: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export default function ControlPanel({
  metronomeActive,
  setMetronomeActive,
  speechActive,
  setSpeechActive,
  panningActive,
  setPanningActive,
  keySoundsActive,
  setKeySoundsActive,
  bpm,
  setBpm,
  volume,
  setVolume
}: ControlPanelProps) {
  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(parseInt(e.target.value, 10));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value, 10));
  };

  const decreaseBpm = () => {
    if (bpm > 30) {
      setBpm(bpm - 5);
    }
  };

  const increaseBpm = () => {
    if (bpm < 200) {
      setBpm(bpm + 5);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Metronome Controls */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-500 px-6 py-3">
          <h2 className="text-white font-semibold flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="mr-2 h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" />
              <path d="M12 22v-3.5" />
              <path d="M12 2v3.5" />
              <path d="M4.93 19.07 7.5 16.5" />
              <path d="M16.5 7.5l2.57-2.57" />
              <path d="M2 12h3.5" />
              <path d="M18.5 12H22" />
              <path d="M4.93 4.93 7.5 7.5" />
              <path d="M16.5 16.5l2.57 2.57" />
            </svg>
            Metronome
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Toggle
                pressed={metronomeActive}
                onPressedChange={setMetronomeActive}
                aria-label="Toggle metronome"
                className="mr-3 data-[state=on]:bg-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">Enable Metronome</label>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={decreaseBpm}
                className="text-blue-500 hover:text-blue-700 p-1"
                aria-label="Decrease BPM"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span className="font-mono text-sm px-2 min-w-[3rem] text-center">{bpm}</span>
              <button 
                onClick={increaseBpm}
                className="text-blue-500 hover:text-blue-700 p-1"
                aria-label="Increase BPM"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="bpm-slider" className="block text-sm font-medium text-gray-700 mb-1">
              BPM (Beats Per Minute)
            </label>
            <input 
              type="range" 
              min="30" 
              max="200" 
              value={bpm} 
              onChange={handleBpmChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
              id="bpm-slider"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs text-center text-gray-500">
            <div>Slow<br/>30</div>
            <div>Practice<br/>60</div>
            <div>Medium<br/>120</div>
            <div>Fast<br/>200</div>
          </div>
        </div>
      </div>
      
      {/* Audio Feedback Controls */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-violet-500 px-6 py-3">
          <h2 className="text-white font-semibold flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="mr-2 h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            Audio Feedback
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Spoken letter toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Toggle
                  pressed={speechActive}
                  onPressedChange={setSpeechActive}
                  aria-label="Toggle speech"
                  className="mr-3 data-[state=on]:bg-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Speak Letters</label>
              </div>
              <div className="text-xs text-gray-500">Hear each letter when typed</div>
            </div>
            
            {/* Audio panning toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Toggle
                  pressed={panningActive}
                  onPressedChange={setPanningActive}
                  aria-label="Toggle audio panning"
                  className="mr-3 data-[state=on]:bg-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Spatial Audio</label>
              </div>
              <div className="text-xs text-gray-500">Position sound left/right</div>
            </div>
            
            {/* Key sounds toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Toggle
                  pressed={keySoundsActive}
                  onPressedChange={setKeySoundsActive}
                  aria-label="Toggle key sounds"
                  className="mr-3 data-[state=on]:bg-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Key Sounds</label>
              </div>
              <div className="text-xs text-gray-500">Subtle click on keypress</div>
            </div>
            
            {/* Sound volume */}
            <div className="mt-6">
              <label htmlFor="volume-slider" className="block text-sm font-medium text-gray-700 mb-1">
                Volume
              </label>
              <div className="flex items-center gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-400" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume} 
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  id="volume-slider"
                />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-400" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
