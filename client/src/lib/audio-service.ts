// Audio context setup
export function setupAudioContext(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

// Create a metronome tick sound
export function createMetronomeSound(audioContext: AudioContext, volume = 0.8): void {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Set up oscillator
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
  
  // Set up gain node for volume and envelope
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Play and automatically stop
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Create a key press sound
export function createKeySound(audioContext: AudioContext, isCorrect: boolean, volume = 0.8): void {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Different sounds for correct vs incorrect keypress
  if (isCorrect) {
    // Higher pitched click for correct key
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.6, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
  } else {
    // Lower pitched, longer sound for error
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.7, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
  }
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Play and automatically stop
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + (isCorrect ? 0.08 : 0.2));
}

// Speak a letter with spatial positioning
export function speakLetterWithSynthesis(letter: string, options: { volume?: number, pan?: number, panningActive?: boolean } = {}): void {
  if (!window.speechSynthesis) return;
  
  // Create speech synthesis utterance - just use the letter without saying "capital"
  const utterance = new SpeechSynthesisUtterance();
  
  // Clear default "capital" speech for uppercase letters
  // Use lowercase to prevent "capital" being said with uppercase letters
  if (letter.length === 1 && letter === letter.toUpperCase()) {
    utterance.text = letter.toLowerCase();
  } else {
    utterance.text = letter;
  }
  
  // Set volume (0-1)
  utterance.volume = options.volume !== undefined ? options.volume : 1;
  
  // Set voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    // Try to get a clear, natural-sounding voice
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Natural'))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
  }
  
  // Speak the letter
  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  window.speechSynthesis.speak(utterance);
  
  // For spatial audio, create a panned sound effect
  if (options.panningActive && options.pan !== undefined) {
    // Small delay to let speech start first
    setTimeout(() => {
      playPannedSound(options.pan || 0, options.volume || 0.8);
    }, 50);
  }
}

// Create and play a panned sound to indicate spatial position
function playPannedSound(pan: number, volume: number): void {
  // Use an audio element with two different audio channels
  // This is a more reliable approach than the Web Audio API for some browsers
  try {
    // Create an audio context for stereo panning
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create an oscillator for the tone
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    
    // Set different frequencies based on pan position for a subtle stereo effect
    // Higher pitch for right side, lower for left
    const baseFreq = 440; // A4 note
    const freqOffset = pan * 50; // Adjust by up to +/- 50Hz based on pan
    oscillator.frequency.setValueAtTime(baseFreq + freqOffset, audioCtx.currentTime);
    
    // Create a gain node for volume control
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.15, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    
    // Create a stereo panner node
    const pannerNode = audioCtx.createStereoPanner();
    
    // Set the pan value (-1 for full left, 1 for full right)
    pannerNode.pan.value = Math.max(-1, Math.min(1, pan));
    
    // Create a second oscillator for stereo effect
    const oscillator2 = audioCtx.createOscillator();
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(baseFreq - freqOffset, audioCtx.currentTime);
    
    // Connect the nodes
    oscillator.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(audioCtx.destination);
    
    // Start and stop the oscillators
    oscillator.start(audioCtx.currentTime);
    oscillator2.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.2);
    oscillator2.stop(audioCtx.currentTime + 0.2);
    
    // Clean up
    setTimeout(() => {
      audioCtx.close().catch(e => console.error("Error closing audio context:", e));
    }, 300);
  } catch (e) {
    console.error("Error playing panned sound:", e);
  }
}

// Alternative implementation for spatial positioning with audio panning
// This creates a more accurate spatial effect but requires a separate audio file/context
export function speakLetterWithPanning(audioContext: AudioContext, letter: string, pan = 0, volume = 0.8): void {
  // This would normally play an audio file for the letter with a panner node
  // However, since we don't have audio files for each letter, this is just a placeholder
  
  // In a real implementation, you would:
  // 1. Load or generate audio files for each letter
  // 2. Create a panner node and set its position
  // 3. Connect the audio source to the panner and play it
  
  console.log(`Speaking letter ${letter} with pan value ${pan} and volume ${volume}`);
}
