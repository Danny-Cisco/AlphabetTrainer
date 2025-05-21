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

// Speak a letter with speech synthesis (with optional panning)
export function speakLetterWithSynthesis(letter: string, options: { 
  volume?: number,
  pan?: number,
  extremePanning?: boolean
} = {}): void {
  if (!window.speechSynthesis) return;
  
  // Special case for panned speech - use our audio worklet approach if pan is specified
  if (options.pan !== undefined && options.pan !== 0) {
    speakLetterWithPanning(letter, options.pan, options.volume || 1, options.extremePanning);
    return;
  }
  
  // Standard speech synthesis for non-panned speech
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
    
    // Determine which keyboard row the letter belongs to and set the base frequency
    // using the customizable pitch values for each row
    const upperLetter = letter.toUpperCase();
    let baseFreq = options.middleRowPitch || 440; // Default to middle row
    
    // Top row (QWERTYUIOP) - higher pitch
    if ('QWERTYUIOP'.includes(upperLetter)) {
      baseFreq = options.topRowPitch || 587.33; // D5 note - higher pitch
    } 
    // Middle row (ASDFGHJKL) - medium pitch
    else if ('ASDFGHJKL'.includes(upperLetter)) {
      baseFreq = options.middleRowPitch || 440; // A4 note - medium pitch
    } 
    // Bottom row (ZXCVBNM) - lower pitch
    else if ('ZXCVBNM'.includes(upperLetter)) {
      baseFreq = options.bottomRowPitch || 329.63; // E4 note - lower pitch
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

// Advanced implementation for speech with stereo panning
// This creates a powerful dual-channel audio experience using two different audio sources
export function speakLetterWithPanning(letter: string, pan = 0, volume = 0.8, extremePanning = false): void {
  if (!window.speechSynthesis) return;

  try {
    // Create audio context
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Calculate panning - either extreme (full L/R) or gradual
    let panValue = pan;
    if (extremePanning) {
      // Use binary panning for extreme mode
      panValue = pan < 0 ? -1.0 : 1.0;
    }

    // Create master gain node for overall volume
    const masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioCtx.destination);
    
    // Create two separate speech utterances - one per channel
    // This is our key innovation - we'll create two separate voices and
    // manipulate their volume to create the stereo panning effect
    
    // Calculate volume distribution between left and right channels
    // When panValue is -1, leftVol = 1, rightVol = 0
    // When panValue is 0, leftVol = 0.5, rightVol = 0.5
    // When panValue is 1, leftVol = 0, rightVol = 1
    const leftVol = Math.max(0, 0.5 - (panValue * 0.5));
    const rightVol = Math.max(0, 0.5 + (panValue * 0.5));
    
    // If we have full left panning, only use left utterance
    if (leftVol > 0) {
      const leftUtterance = new SpeechSynthesisUtterance();
      if (letter.length === 1 && letter === letter.toUpperCase()) {
        leftUtterance.text = letter.toLowerCase();
      } else {
        leftUtterance.text = letter;
      }
      
      // Enhance "leftness" by setting properties of the left utterance
      // We set volume & pitch slightly different for each channel to enhance the effect
      leftUtterance.volume = leftVol * volume;
      leftUtterance.rate = 1.0;
      
      // Try to get a clear voice for the left channel
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Find a suitable voice
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Natural'))
        );
        
        if (preferredVoice) {
          leftUtterance.voice = preferredVoice;
        }
      }
      
      // Queue the left utterance
      window.speechSynthesis.speak(leftUtterance);
    }

    // If we have full right panning, only use right utterance
    if (rightVol > 0) {
      // Create slight delay for right channel to enhance stereo effect
      setTimeout(() => {
        const rightUtterance = new SpeechSynthesisUtterance();
        if (letter.length === 1 && letter === letter.toUpperCase()) {
          rightUtterance.text = letter.toLowerCase();
        } else {
          rightUtterance.text = letter;
        }
        
        // Enhance "rightness" with slightly different properties
        rightUtterance.volume = rightVol * volume;
        rightUtterance.rate = 1.0;
        
        // Optionally use a different voice for right channel to enhance separation
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 1) {
          // Try to find a different but still clear voice for right channel
          const preferredVoice = voices.find(voice => 
            voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Natural'))
          );
          
          if (preferredVoice) {
            rightUtterance.voice = preferredVoice;
          }
        }
        
        // Queue the right utterance
        window.speechSynthesis.speak(rightUtterance);
      }, extremePanning ? 0 : 10); // No delay in extreme mode for cleaner separation
    }
    
    // Additionally create stereo panned tones to reinforce the spatial effect
    const oscillatorLeft = audioCtx.createOscillator();
    const oscillatorRight = audioCtx.createOscillator();
    
    // Use different waveforms for better stereo impression
    oscillatorLeft.type = 'sine';
    oscillatorRight.type = 'sine';
    
    // Determine base frequency by keyboard row
    const upperLetter = letter.toUpperCase();
    let baseFreq = 440; // Default
    
    // Set different frequencies for different rows
    if ('QWERTYUIOP'.includes(upperLetter)) {
      baseFreq = 650; // Higher for top row
    } else if ('ASDFGHJKL'.includes(upperLetter)) {
      baseFreq = 440; // Middle for home row
    } else if ('ZXCVBNM'.includes(upperLetter)) {
      baseFreq = 300; // Lower for bottom row
    }
    
    // Add letter-specific pitch variation
    const letterIndex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(upperLetter);
    if (letterIndex >= 0) {
      baseFreq += letterIndex * 3; // Subtle difference per letter
    }
    
    // Set slightly different frequencies for left and right to create spaciousness
    oscillatorLeft.frequency.setValueAtTime(baseFreq - 3, audioCtx.currentTime);
    oscillatorRight.frequency.setValueAtTime(baseFreq + 3, audioCtx.currentTime);
    
    // Create gain nodes for left and right oscillators
    const gainLeft = audioCtx.createGain();
    const gainRight = audioCtx.createGain();
    
    // Connect oscillators to their respective gain nodes
    oscillatorLeft.connect(gainLeft);
    oscillatorRight.connect(gainRight);
    
    // Connect gain nodes to master gain
    gainLeft.connect(masterGain);
    gainRight.connect(masterGain);
    
    // Set volume envelope that starts soft, peaks quickly and fades
    gainLeft.gain.setValueAtTime(0, audioCtx.currentTime);
    gainLeft.gain.linearRampToValueAtTime(leftVol * 0.15, audioCtx.currentTime + 0.02);
    gainLeft.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    gainRight.gain.setValueAtTime(0, audioCtx.currentTime);
    gainRight.gain.linearRampToValueAtTime(rightVol * 0.15, audioCtx.currentTime + 0.02);
    gainRight.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    // Start and stop oscillators
    oscillatorLeft.start(audioCtx.currentTime);
    oscillatorRight.start(audioCtx.currentTime);
    oscillatorLeft.stop(audioCtx.currentTime + 0.3);
    oscillatorRight.stop(audioCtx.currentTime + 0.3);
    
    // Clean up
    setTimeout(() => {
      audioCtx.close().catch(e => console.error("Error closing audio context:", e));
    }, 500);
  } catch (e) {
    console.error("Error with panned speech:", e);
    
    // Fallback to standard speech if the advanced method fails
    const utterance = new SpeechSynthesisUtterance();
    if (letter.length === 1 && letter === letter.toUpperCase()) {
      utterance.text = letter.toLowerCase();
    } else {
      utterance.text = letter;
    }
    utterance.volume = volume;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}
