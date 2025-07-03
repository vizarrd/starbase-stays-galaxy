import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Calendar, LogOut, Volume2, VolumeX } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { signOut, getUserDisplayName } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('starbase-sound-enabled') === 'true';
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Farewell, Jedi",
        description: "You have successfully logged out",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

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

  const displayName = getUserDisplayName(user);

  return (
    <>
      <div className="starfield"></div>
      <header className="relative z-50 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl md:text-3xl font-orbitron font-bold glow-text-red">
                STARBASE
              </div>
              <div className="text-2xl md:text-3xl font-orbitron font-bold text-accent glow-text-blue">
                STAYS
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`text-lg font-exo transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary glow-text-red' : 'text-foreground'
                }`}
              >
                Browse
              </Link>
              
              {user && (
                <Link 
                  to="/bookings" 
                  className={`text-lg font-exo transition-colors hover:text-accent ${
                    isActive('/bookings') ? 'text-accent glow-text-blue' : 'text-foreground'
                  }`}
                >
                  My Bookings
                </Link>
              )}

              {/* Sound Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSound}
                className="text-muted-foreground hover:text-primary"
                aria-label={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              {/* Auth Section */}
              {loading ? (
                <div className="w-8 h-8 death-star-loader scale-50" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="lightsaber-button-blue border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Jedi {displayName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookings" className="cursor-pointer">
                        <Calendar className="w-4 h-4 mr-2" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  className="lightsaber-button border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => navigate('/auth')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground hover:text-primary"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={`text-lg font-exo transition-colors hover:text-primary ${
                    isActive('/') ? 'text-primary glow-text-red' : 'text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse
                </Link>
                
                {user && (
                  <Link 
                    to="/bookings" 
                    className={`text-lg font-exo transition-colors hover:text-accent ${
                      isActive('/bookings') ? 'text-accent glow-text-blue' : 'text-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    My Bookings
                  </Link>
                )}

                {/* Mobile Sound Toggle */}
                <Button
                  variant="ghost"
                  onClick={toggleSound}
                  className="justify-start text-muted-foreground hover:text-primary w-fit"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                  {soundEnabled ? 'Disable Sound' : 'Enable Sound'}
                </Button>

                {/* Mobile Auth */}
                {loading ? (
                  <div className="w-8 h-8 death-star-loader scale-50" />
                ) : user ? (
                  <div className="flex flex-col space-y-2">
                    <div className="text-accent font-exo">
                      Welcome, Jedi {displayName}
                    </div>
                    <Link 
                      to="/profile" 
                      className="text-foreground hover:text-primary font-exo"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Profile
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="justify-start text-red-400 hover:text-red-300 w-fit"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="lightsaber-button border-primary text-primary hover:bg-primary hover:text-primary-foreground w-fit"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/auth');
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;