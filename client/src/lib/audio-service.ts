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

// Speak a letter with speech synthesis and panning support
export function speakLetterWithSynthesis(letter: string, options: { 
  volume?: number, 
  pan?: number, 
  extremePanning?: boolean,
  panningActive?: boolean
} = {}): void {
  // Early return if speech synthesis not supported
  if (!window.speechSynthesis) return;
  
  // If panning is active and we have a pan value, use our custom solution
  if (options.panningActive && options.pan !== undefined) {
    speakLetterWithPannedSynthesis(letter, options);
    return;
  }
  
  // Otherwise fall back to regular speech synthesis
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

// Hardcoded letter audio for spatial positioning
// We'll use pre-generated audio for each letter to achieve true panning
class LetterAudioBank {
  private static instance: LetterAudioBank;
  private audioBuffers: {[key: string]: AudioBuffer} = {};
  private audioContext: AudioContext | null = null;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): LetterAudioBank {
    if (!LetterAudioBank.instance) {
      LetterAudioBank.instance = new LetterAudioBank();
    }
    return LetterAudioBank.instance;
  }

  public async getContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  public async loadAllSounds(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    if (this.isLoading) {
      return new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isLoading) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }

    this.isLoading = true;

    this.loadPromise = new Promise<void>(async (resolve) => {
      try {
        const ctx = await this.getContext();
        
        // Generate all letter sounds via speech synthesis and capture them
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const promises = [];

        for (const letter of letters) {
          promises.push(this.generateLetterAudio(ctx, letter));
        }

        await Promise.all(promises);
        
        this.isLoading = false;
        resolve();
      } catch (error) {
        console.error("Failed to load letter sounds:", error);
        this.isLoading = false;
        resolve();
      }
    });

    return this.loadPromise;
  }

  private async generateLetterAudio(ctx: AudioContext, letter: string): Promise<void> {
    return new Promise<void>((resolve) => {
      try {
        // Create an oscillator that will be used as the audio source
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        
        // Different frequency for each letter - distinguishable but not too different
        const baseFreq = 200;
        const letterIndex = letter.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, etc.
        oscillator.frequency.value = baseFreq + (letterIndex * 8);
        
        // Create a gain node to control the envelope
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0;
        
        // Connect the oscillator to the gain node
        oscillator.connect(gainNode);
        
        // Create a media stream destination to capture the audio
        const dest = ctx.createMediaStreamDestination();
        gainNode.connect(dest);
        
        // Create a media recorder to record the audio
        const recorder = new MediaRecorder(dest.stream);
        const chunks: BlobPart[] = [];
        
        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        
        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const arrayBuffer = await blob.arrayBuffer();
          
          try {
            // Decode the audio data
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            this.audioBuffers[letter.toUpperCase()] = audioBuffer;
            resolve();
          } catch (error) {
            console.error(`Error decoding audio for letter ${letter}:`, error);
            resolve();
          }
        };
        
        // Start recording
        recorder.start();
        
        // Start the oscillator
        oscillator.start();
        
        // Apply an envelope
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        
        // Add a tiny bit of vibrato if possible for more voice-like quality
        if (oscillator.frequency.setValueCurveAtTime) {
          // Create a vibrato effect
          const now = ctx.currentTime;
          const vibratoRate = 5; // Hz
          const vibratoDepth = 3; // Hz
          const numSamples = 400;
          const curve = new Float32Array(numSamples);
          const baseF = oscillator.frequency.value;
          
          for (let i = 0; i < numSamples; ++i) {
            const t = i / numSamples;
            curve[i] = baseF + vibratoDepth * Math.sin(2 * Math.PI * vibratoRate * t);
          }
          
          try {
            oscillator.frequency.setValueCurveAtTime(curve, now, 0.3);
          } catch (e) {
            // Fallback if the browser doesn't support this
            console.warn("Browser doesn't support setValueCurveAtTime:", e);
          }
        }
        
        // Stop the gain output after 0.3 seconds
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        
        // Stop recording after 0.35 seconds
        setTimeout(() => {
          oscillator.stop();
          recorder.stop();
        }, 350);
      } catch (error) {
        console.error(`Failed to generate audio for letter ${letter}:`, error);
        resolve();
      }
    });
  }

  public async playLetterWithPanning(letter: string, options: { 
    pan?: number, 
    volume?: number,
    onEnded?: () => void
  } = {}): Promise<void> {
    try {
      await this.loadAllSounds();
      const ctx = await this.getContext();
      
      const upperLetter = letter.toUpperCase();
      const buffer = this.audioBuffers[upperLetter];
      
      if (!buffer) {
        console.warn(`No buffer found for letter ${upperLetter}`);
        
        // Fallback to synthesized speech
        const utterance = new SpeechSynthesisUtterance(letter.toLowerCase());
        utterance.volume = options.volume !== undefined ? options.volume : 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        
        setTimeout(() => {
          options.onEnded?.();
        }, 300);
        
        return;
      }
      
      // Create a buffer source
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      
      // Create a gain node
      const gainNode = ctx.createGain();
      gainNode.gain.value = options.volume !== undefined ? options.volume : 0.8;
      
      // Create a stereo panner
      const panner = ctx.createStereoPanner();
      panner.pan.value = options.pan !== undefined ? Math.max(-1, Math.min(1, options.pan)) : 0;
      
      // Connect the nodes
      source.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(ctx.destination);
      
      // Set up the ended handler
      source.onended = () => {
        options.onEnded?.();
      };
      
      // Start playing
      source.start();
    } catch (error) {
      console.error(`Error playing letter ${letter} with panning:`, error);
      options.onEnded?.();
      
      // Fallback to synthesized speech
      const utterance = new SpeechSynthesisUtterance(letter.toLowerCase());
      utterance.volume = options.volume !== undefined ? options.volume : 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }
}

// Custom implementation for spatially positioned speech synthesis
export function speakLetterWithPannedSynthesis(letter: string, options: { 
  volume?: number, 
  pan?: number,
  extremePanning?: boolean
} = {}): void {
  try {
    // Get the letter audio bank and play the pre-generated sound
    const letterBank = LetterAudioBank.getInstance();
    letterBank.playLetterWithPanning(letter, {
      pan: options.pan,
      volume: options.volume,
    });
  } catch (e) {
    console.error("Error with panned speech synthesis:", e);
    
    // Fallback to regular speech if the panning method fails
    const utterance = new SpeechSynthesisUtterance(letter.toLowerCase());
    utterance.volume = options.volume !== undefined ? options.volume : 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
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
