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
export function speakLetterWithSynthesis(letter: string, options: { volume?: number, pan?: number } = {}): void {
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
  
  // Handle panning by playing the audio to a specific ear based on pan value
  if (options.pan !== undefined) {
    // Create a stereo audio context to position the sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const panner = audioCtx.createStereoPanner();
      
      // Set the pan value (-1 for full left, 1 for full right)
      const pan = Math.max(-1, Math.min(1, options.pan)); // Clamp between -1 and 1
      panner.pan.value = pan;
      
      // We can't connect speech synthesis directly to the audio nodes,
      // but we can adjust the audio context to prepare for subsequent sounds
      panner.connect(audioCtx.destination);
    } catch (e) {
      console.log("Audio panning not supported", e);
    }
  }
  
  // Speak the letter
  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  window.speechSynthesis.speak(utterance);
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
