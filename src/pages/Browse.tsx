import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import Header from '@/components/Header';
import SearchBar, { SearchFilters } from '@/components/SearchBar';
import RoomCard from '@/components/RoomCard';
import FiltersSidebar, { FilterState } from '@/components/FiltersSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchRooms, Room, RoomFilters } from '@/lib/supabase-rooms';
import { useToast } from '@/hooks/use-toast';

const Browse = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('starbase-sound-enabled') === 'true';
  });
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FilterState>({
    priceMin: '',
    priceMax: '',
    amenities: [],
    roomType: 'all'
  });

  // Load initial rooms
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setIsLoading(true);
        const roomsData = await fetchRooms();
        setRooms(roomsData);
      } catch (error) {
        console.error('Error loading rooms:', error);
        toast({
          title: "Error",
          description: "Failed to load accommodations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, [toast]);

  const playLightsaberSound = () => {
    if (!soundEnabled) return;
    
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

  const handleSearch = async (searchFilters: SearchFilters) => {
    setIsSearching(true);
    
    try {
      const roomFilters: RoomFilters = {
        location: searchFilters.city,
        maxGuests: searchFilters.guests ? parseInt(searchFilters.guests) : undefined,
      };

      const searchResults = await fetchRooms(roomFilters);
      setRooms(searchResults);

      toast({
        title: "Search Complete",
        description: `Found ${searchResults.length} accommodations matching your criteria`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error searching rooms:', error);
      toast({
        title: "Search Error",
        description: "Failed to search accommodations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      toast({
        title: "Booking Initiated",
        description: `Preparing to book ${room.name}. Authentication required for full booking system.`,
        duration: 4000,
      });
    }
  };

  const handleApplyFilters = async () => {
    setIsFiltersOpen(false);
    if (soundEnabled) playLightsaberSound();
    
    try {
      setIsLoading(true);
      
      const roomFilters: RoomFilters = {
        minPrice: filters.priceMin ? parseFloat(filters.priceMin) : undefined,
        maxPrice: filters.priceMax ? parseFloat(filters.priceMax) : undefined,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        roomType: filters.roomType !== 'all' ? filters.roomType : undefined,
      };

      const filteredRooms = await fetchRooms(roomFilters);
      setRooms(filteredRooms);
      
      toast({
        title: "Filters Applied",
        description: `Found ${filteredRooms.length} matching accommodations`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error applying filters:', error);
      toast({
        title: "Filter Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      amenities: [],
      roomType: 'all'
    });
    
    try {
      setIsLoading(true);
      const allRooms = await fetchRooms();
      setRooms(allRooms);
      
      toast({
        title: "Filters Cleared",
        description: "All filters have been reset",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error clearing filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Search */}
        <section className="text-center mb-12">
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4">
              <span className="text-primary glow-text-red">GALACTIC</span>{' '}
              <span className="text-accent glow-text-blue">STAYS</span>
            </h1>
            <p className="text-xl text-muted-foreground font-exo mb-8">
              Discover extraordinary accommodations across the galaxy. 
              From Jedi temples to Imperial suites, your perfect stay awaits.
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </section>

        {/* Results Section */}
        <section className="lg:grid lg:grid-cols-[300px,1fr] lg:gap-8">
          {/* Filters Sidebar */}
          <FiltersSidebar
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />

          {/* Main Content */}
          <div className="lg:pl-0">
            {/* Mobile Filter Button */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setIsFiltersOpen(true)}
                className="border-border hover:border-primary"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-orbitron font-bold text-foreground">
                Available Accommodations
              </h2>
              <span className="text-muted-foreground font-exo">
                {rooms.length} results
              </span>
            </div>

            {/* Loading State */}
            {isLoading && (
              <LoadingSpinner 
                message="Scanning the galaxy for perfect accommodations..." 
                size="lg"
              />
            )}

            {/* Results Grid */}
            {!isLoading && (
              <>
                {rooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        onBook={handleBookRoom}
                        playSound={soundEnabled ? playLightsaberSound : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <div className="death-star-loader mx-auto opacity-30" />
                    </div>
                    <h3 className="text-xl font-orbitron font-bold text-muted-foreground mb-2">
                      No Accommodations Found
                    </h3>
                    <p className="text-muted-foreground font-exo">
                      Try adjusting your search criteria or clearing filters
                    </p>
                    <Button 
                      onClick={handleClearFilters}
                      variant="outline"
                      className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Browse;