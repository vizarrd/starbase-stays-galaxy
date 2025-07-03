import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SoundToggle = () => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('starbase-sound-enabled');
    setSoundEnabled(saved === 'true');
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('starbase-sound-enabled', newState.toString());
    
    toast({
      title: newState ? "Sound Effects Enabled" : "Sound Effects Disabled",
      description: newState 
        ? "May the Force be with you! 🔊" 
        : "Silent mode activated 🔇",
      duration: 2000,
    });

    // Play test sound if enabling
    if (newState) {
      playLightsaberSound();
    }
  };

  const playLightsaberSound = () => {
    if (!soundEnabled) return;
    
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  return {
    SoundToggleButton: (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSound}
        className="text-muted-foreground hover:text-primary"
        aria-label={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
      >
        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>
    ),
    playLightsaberSound,
    soundEnabled
  };
};

export default SoundToggle;