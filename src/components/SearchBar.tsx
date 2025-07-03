import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export interface SearchFilters {
  city: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: string;
}

const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('1');

  const handleSearch = () => {
    onSearch({
      city,
      checkIn,
      checkOut,
      guests
    });
  };

  return (
    <div className="bg-card/90 backdrop-blur-md border border-border rounded-2xl p-6 md:p-8 shadow-2xl max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-primary glow-text-red mb-2">
          Galactic Search Console
        </h2>
        <p className="text-muted-foreground font-exo">
          Find your perfect accommodation across the galaxy
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* City Input */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-exo text-foreground flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            Destination
          </Label>
          <Input
            id="city"
            placeholder="Enter city or planet..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-input border-border focus:border-primary focus:ring-primary/20"
          />
        </div>

        {/* Check-in Date */}
        <div className="space-y-2">
          <Label className="text-sm font-exo text-foreground flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1 text-accent" />
            Check-in
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-input border-border hover:border-accent",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <Label className="text-sm font-exo text-foreground flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1 text-accent" />
            Check-out
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-input border-border hover:border-accent",
                  !checkOut && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label className="text-sm font-exo text-foreground flex items-center">
            <Users className="w-4 h-4 mr-1 text-rebel" />
            Travelers
          </Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="bg-input border-border focus:border-primary">
              <SelectValue placeholder="Select guests" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Traveler' : 'Travelers'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <div className="text-center">
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          className="lightsaber-button bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-exo font-semibold"
        >
          {isLoading ? (
            <div className="death-star-loader scale-50 mr-2" />
          ) : (
            <Search className="w-5 h-5 mr-2" />
          )}
          {isLoading ? 'Scanning Galaxy...' : 'Begin Search'}
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;