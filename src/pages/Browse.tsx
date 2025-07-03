import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import Header from '@/components/Header';
import SearchBar, { SearchFilters } from '@/components/SearchBar';
import RoomCard from '@/components/RoomCard';
import FiltersSidebar, { FilterState } from '@/components/FiltersSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import SoundToggle from '@/components/SoundToggle';
import { dummyRooms, Room } from '@/data/rooms';
import { useToast } from '@/hooks/use-toast';

const Browse = () => {
  const [rooms, setRooms] = useState<Room[]>(dummyRooms);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(dummyRooms);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FilterState>({
    priceMin: '',
    priceMax: '',
    amenities: [],
    roomType: 'all'
  });

  const { SoundToggleButton, playLightsaberSound, soundEnabled } = SoundToggle();

  // Apply filters to rooms
  useEffect(() => {
    let filtered = [...rooms];

    // Price filter
    if (filters.priceMin) {
      filtered = filtered.filter(room => room.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(room => room.price <= parseInt(filters.priceMax));
    }

    // Room type filter
    if (filters.roomType && filters.roomType !== 'all') {
      filtered = filtered.filter(room => room.type === filters.roomType);
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(room => 
        filters.amenities.every(amenity => room.amenities.includes(amenity))
      );
    }

    setFilteredRooms(filtered);
  }, [filters, rooms]);

  const handleSearch = async (searchFilters: SearchFilters) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter rooms based on search criteria
    let searchResults = [...dummyRooms];
    
    if (searchFilters.city) {
      searchResults = searchResults.filter(room => 
        room.location.toLowerCase().includes(searchFilters.city.toLowerCase())
      );
    }
    
    if (searchFilters.guests) {
      const guestCount = parseInt(searchFilters.guests);
      searchResults = searchResults.filter(room => room.maxGuests >= guestCount);
    }

    setRooms(searchResults);
    setIsLoading(false);

    toast({
      title: "Search Complete",
      description: `Found ${searchResults.length} accommodations matching your criteria`,
      duration: 3000,
    });
  };

  const handleBookRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      toast({
        title: "Booking Initiated",
        description: `Preparing to book ${room.name}. Supabase integration required for full booking system.`,
        duration: 4000,
      });
    }
  };

  const handleApplyFilters = () => {
    setIsFiltersOpen(false);
    if (soundEnabled) playLightsaberSound();
    
    toast({
      title: "Filters Applied",
      description: `Found ${filteredRooms.length} matching accommodations`,
      duration: 2000,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      amenities: [],
      roomType: 'all'
    });
    
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
      duration: 2000,
    });
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
          
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
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
            {/* Mobile Filter Button and Controls */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setIsFiltersOpen(true)}
                className="border-border hover:border-primary"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              {SoundToggleButton}
            </div>

            {/* Desktop Sound Toggle */}
            <div className="hidden lg:flex justify-end mb-6">
              {SoundToggleButton}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-orbitron font-bold text-foreground">
                Available Accommodations
              </h2>
              <span className="text-muted-foreground font-exo">
                {filteredRooms.length} results
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
                {filteredRooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => (
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