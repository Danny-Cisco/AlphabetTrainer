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
  
  // Create speech synthesis utterance
  const utterance = new SpeechSynthesisUtterance(letter);
  
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
  
  // Handle panning (stereo positioning)
  if (options.pan !== undefined) {
    // The SpeechSynthesis API doesn't support panning directly
    // We can try to simulate this by manipulating the pitch to give a subtle difference
    // between left and right
    
    // For left/right ear effect, slightly modify the pitch
    // This is a crude approximation since speechSynthesis doesn't support real panning
    const pan = Math.max(-1, Math.min(1, options.pan)); // Clamp between -1 and 1
    
    if (pan < 0) {
      // For left side, slightly lower pitch
      utterance.pitch = 1 + (pan * 0.2); // 0.8 to 1.0
    } else if (pan > 0) {
      // For right side, slightly higher pitch
      utterance.pitch = 1 + (pan * 0.2); // 1.0 to 1.2
    } else {
      utterance.pitch = 1; // Center
    }
  }
  
  // Speak the letter
  speechSynthesis.speak(utterance);
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
