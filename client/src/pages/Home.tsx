import TypingInterface from "@/components/TypingInterface";
import ControlPanel from "@/components/ControlPanel";
import { useState } from "react";
import { Helmet } from "react-helmet";

export default function Home() {
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const [panningActive, setPanningActive] = useState(false);
  const [keySoundsActive, setKeySoundsActive] = useState(false);
  const [bpm, setBpm] = useState(60);
  const [volume, setVolume] = useState(80);

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
              metronomeActive={metronomeActive}
              speechActive={speechActive}
              panningActive={panningActive}
              keySoundsActive={keySoundsActive}
              bpm={bpm}
              volume={volume}
            />
            
            <ControlPanel 
              metronomeActive={metronomeActive}
              setMetronomeActive={setMetronomeActive}
              speechActive={speechActive}
              setSpeechActive={setSpeechActive}
              panningActive={panningActive}
              setPanningActive={setPanningActive}
              keySoundsActive={keySoundsActive}
              setKeySoundsActive={setKeySoundsActive}
              bpm={bpm}
              setBpm={setBpm}
              volume={volume}
              setVolume={setVolume}
            />
          </main>
          
          <footer className="mt-10 text-center text-gray-500 text-sm">
            <p>TypeTone - Alphabet Typing Practice with Audio Feedback</p>
          </footer>
        </div>
      </div>
    </>
  );
}
