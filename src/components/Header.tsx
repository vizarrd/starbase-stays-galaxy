import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-lg font-exo transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary glow-text-red' : 'text-foreground'
                }`}
              >
                Browse
              </Link>
              <Link 
                to="/bookings" 
                className={`text-lg font-exo transition-colors hover:text-accent ${
                  isActive('/bookings') ? 'text-accent glow-text-blue' : 'text-foreground'
                }`}
              >
                My Bookings
              </Link>
              <Button 
                variant="outline" 
                className="lightsaber-button-blue border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
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
                <Button 
                  variant="outline" 
                  className="lightsaber-button-blue border-accent text-accent hover:bg-accent hover:text-accent-foreground w-fit"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;