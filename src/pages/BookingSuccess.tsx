import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, MapPin, Star, Home } from 'lucide-react';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchBookingById, Booking } from '@/lib/bookings';
import { useToast } from '@/hooks/use-toast';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!sessionId) {
        toast({
          title: "Invalid Session",
          description: "No booking session found.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        // In a real implementation, you'd use the session_id to fetch booking details
        // For now, we'll show a success message
        setLoading(false);
        
        toast({
          title: "Booking Confirmed!",
          description: "Your galactic accommodation has been successfully booked.",
          duration: 5000,
        });
      } catch (error) {
        console.error('Error loading booking details:', error);
        toast({
          title: "Error",
          description: "Failed to load booking details.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    loadBookingDetails();
  }, [sessionId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Confirming your booking..." size="lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-2">
              <span className="text-green-400 glow-text-blue">BOOKING</span>{' '}
              <span className="text-primary glow-text-red">CONFIRMED</span>
            </h1>
            <p className="text-muted-foreground font-exo text-lg">
              Your galactic accommodation has been successfully reserved!
            </p>
          </div>

          {/* Booking Details */}
          <Card className="bg-card/95 backdrop-blur-sm border-border mb-6">
            <CardHeader>
              <CardTitle className="font-orbitron text-foreground flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Booking Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="death-star-loader mx-auto opacity-30 mb-4" />
                <p className="text-muted-foreground font-exo">
                  Booking details will be available once Stripe webhook integration is complete.
                </p>
                <p className="text-sm text-muted-foreground font-exo mt-2">
                  Session ID: {sessionId}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-card/95 backdrop-blur-sm border-border mb-6">
            <CardHeader>
              <CardTitle className="font-orbitron text-foreground">
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-exo font-semibold">Confirmation Email</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a confirmation email with your booking details and check-in instructions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-exo font-semibold">Prepare for Your Stay</h4>
                    <p className="text-sm text-muted-foreground">
                      Review the accommodation details and prepare for your galactic adventure.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-rebel/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-rebel text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-exo font-semibold">Check-In</h4>
                    <p className="text-sm text-muted-foreground">
                      Arrive at your destination and enjoy your stay across the galaxy.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/bookings" className="flex-1">
              <Button 
                className="w-full lightsaber-button bg-primary hover:bg-primary/90 text-primary-foreground font-exo font-semibold"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View My Bookings
              </Button>
            </Link>
            
            <Link to="/" className="flex-1">
              <Button 
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground font-exo font-semibold"
              >
                <Home className="w-4 h-4 mr-2" />
                Browse More Rooms
              </Button>
            </Link>
          </div>

          {/* Support */}
          <Card className="bg-card/95 backdrop-blur-sm border-border mt-6">
            <CardContent className="p-6 text-center">
              <h3 className="font-orbitron font-bold text-foreground mb-2">
                Need Help?
              </h3>
              <p className="text-muted-foreground font-exo mb-4">
                Our galactic support team is here to assist you with any questions about your booking.
              </p>
              <Button 
                variant="outline" 
                className="border-border hover:border-primary hover:text-primary"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BookingSuccess;