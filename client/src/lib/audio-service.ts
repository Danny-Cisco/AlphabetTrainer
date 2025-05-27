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

// Speak a letter with speech synthesis (voice only)
export function speakLetterWithSynthesis(letter: string, options: { volume?: number } = {}): void {
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
}

// Play a panned tone for each letter based on keyboard position and row
export function playPannedToneForLetter(letter: string, options: { 
  pan?: number, 
  volume?: number,
  numberRowPitch?: number,
  topRowPitch?: number,
  middleRowPitch?: number,
  bottomRowPitch?: number
} = {}): void {
  if (!letter) return;
  
  try {
    // Create an audio context for stereo panning
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create an oscillator for the tone
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    
    // Get volume and pan values
    const volume = options.volume !== undefined ? options.volume : 0.8;
    const pan = options.pan !== undefined ? Math.max(-1, Math.min(1, options.pan)) : 0;
    
    // Determine which keyboard row the character belongs to and set the base frequency
    // using the customizable pitch values for each row
    const upperLetter = letter.toUpperCase();
    let baseFreq = options.middleRowPitch || 500; // Default to middle row
    
    // Number row (1234567890 and !@#$%^&*() plus `~-_=+) - highest pitch
    if ('1234567890!@#$%^&*()`~-_=+'.includes(letter)) {
      baseFreq = options.numberRowPitch || 1000;
    }
    // Top row (QWERTYUIOP and []{}|\) - higher pitch  
    else if ('QWERTYUIOP[]{}|\\'.includes(upperLetter) || '[]{}|\\'.includes(letter)) {
      baseFreq = options.topRowPitch || 750;
    } 
    // Middle row (ASDFGHJKL and ;'":) - medium pitch
    else if ('ASDFGHJKL;\'"'.includes(upperLetter)) {
      baseFreq = options.middleRowPitch || 500;
    } 
    // Bottom row (ZXCVBNM and ,./<>?) - lower pitch
    else if ('ZXCVBNM,./<>?'.includes(upperLetter)) {
      baseFreq = options.bottomRowPitch || 250;
    }
    // Extended punctuation that doesn't fit standard rows - use middle row
    else if ('`~-_=+'.includes(letter)) {
      baseFreq = options.middleRowPitch || 500;
    }
    
    // Set different frequencies based on pan position for a subtle stereo effect
    // Higher pitch for right side, lower for left within each base frequency
    const freqOffset = pan * 20; // Adjust by up to +/- 20Hz based on pan
    oscillator.frequency.setValueAtTime(baseFreq + freqOffset, audioCtx.currentTime);
    
    // Create a gain node for volume control
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.15, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    
    // Create a stereo panner node
    const pannerNode = audioCtx.createStereoPanner();
    pannerNode.pan.value = pan;
    
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
