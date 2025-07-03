import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon,
  Wifi,
  Car,
  Utensils,
  ChevronLeft,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchRoomById, Room } from '@/lib/supabase-rooms';
import { createCheckoutSession } from '@/lib/stripe';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [soundEnabled] = useState(() => {
    return localStorage.getItem('starbase-sound-enabled') === 'true';
  });

  useEffect(() => {
    const loadRoom = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const roomData = await fetchRoomById(id);
        
        if (!roomData) {
          toast({
            title: "Room Not Found",
            description: "The requested accommodation could not be found.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        setRoom(roomData);
      } catch (error) {
        console.error('Error loading room:', error);
        toast({
          title: "Error",
          description: "Failed to load room details. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [id, navigate, toast]);

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

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wi-fi') || amenityLower.includes('wifi')) {
      return <Wifi className="w-4 h-4" />;
    }
    if (amenityLower.includes('parking')) {
      return <Car className="w-4 h-4" />;
    }
    if (amenityLower.includes('breakfast') || amenityLower.includes('food')) {
      return <Utensils className="w-4 h-4" />;
    }
    return null;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!room || !checkIn || !checkOut) return 0;
    return room.price_per_night * calculateNights();
  };

  const handleBookNow = async () => {
    if (soundEnabled) playLightsaberSound();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book this accommodation.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Dates Required",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    if (!room) return;

    try {
      setBookingLoading(true);
      
      await createCheckoutSession({
        room_id: room.id,
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
        total_price: calculateTotal(),
      });

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to initiate booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const nextImage = () => {
    if (room?.image_urls) {
      setCurrentImageIndex((prev) => 
        prev === room.image_urls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (room?.image_urls) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? room.image_urls.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Loading accommodation details..." size="lg" />
        </main>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-orbitron font-bold text-muted-foreground mb-4">
              Accommodation Not Found
            </h1>
            <Link to="/">
              <Button className="lightsaber-button bg-primary hover:bg-primary/90 text-primary-foreground">
                Return to Browse
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const images = room.image_urls?.length > 0 ? room.image_urls : [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
  ];

  const nights = calculateNights();
  const totalPrice = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-exo mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <Card className="overflow-hidden bg-card/95 backdrop-blur-sm border-border">
              <div className="relative">
                <img 
                  src={images[currentImageIndex]} 
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            index === currentImageIndex ? "bg-white" : "bg-white/50"
                          )}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Room Details */}
            <Card className="bg-card/95 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-orbitron font-bold text-foreground mb-2">
                      {room.name}
                    </h1>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      <span className="font-exo text-lg">{room.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                        <span className="font-exo font-semibold text-lg">{room.rating}</span>
                        <span className="text-muted-foreground font-exo ml-1">/5</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-5 h-5 mr-1" />
                        <span className="font-exo">Up to {room.max_guests} guests</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {room.room_type}
                    </Badge>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="text-lg font-orbitron font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground font-exo leading-relaxed">
                      {room.description}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="text-lg font-orbitron font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {room.amenities?.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          {getAmenityIcon(amenity)}
                          <span className="font-exo text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section (Placeholder) */}
            <Card className="bg-card/95 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-orbitron font-semibold mb-4">Guest Reviews</h3>
                <div className="text-center py-8">
                  <div className="death-star-loader mx-auto opacity-30 mb-4" />
                  <p className="text-muted-foreground font-exo">
                    Reviews coming soon. Connect to Supabase for full review system.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <Card className="bg-card/95 backdrop-blur-sm border-border sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-orbitron font-bold text-primary glow-text-red">
                    ${room.price_per_night}
                  </div>
                  <div className="text-muted-foreground font-exo">per night</div>
                </div>

                <div className="space-y-4">
                  {/* Date Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-exo text-foreground mb-1 block">
                        Check-in
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-input border-border",
                              !checkIn && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkIn ? format(checkIn, "MMM dd") : "Select"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-exo text-foreground mb-1 block">
                        Check-out
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-input border-border",
                              !checkOut && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOut ? format(checkOut, "MMM dd") : "Select"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Booking Summary */}
                  {checkIn && checkOut && nights > 0 && (
                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between font-exo">
                        <span>${room.price_per_night} × {nights} nights</span>
                        <span>${(room.price_per_night * nights).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-exo font-semibold text-lg border-t border-border pt-2">
                        <span>Total:</span>
                        <span className="text-primary">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleBookNow}
                    disabled={bookingLoading || !checkIn || !checkOut || nights <= 0}
                    className="w-full lightsaber-button bg-primary hover:bg-primary/90 text-primary-foreground font-exo font-semibold text-lg py-3"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="death-star-loader scale-50 mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Book Now
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground font-exo text-center">
                    Secure payment powered by Stripe. You'll be redirected to complete your booking.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomDetails;