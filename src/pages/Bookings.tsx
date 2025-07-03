import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Star, ArrowLeft, Eye } from 'lucide-react';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchUserBookings, Booking } from '@/lib/bookings';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Bookings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadBookings();
    }
  }, [user, authLoading, navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const userBookings = await fetchUserBookings();
      setBookings(userBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load your bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Loading your bookings..." size="lg" />
        </main>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-exo mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-2">
            <span className="text-accent glow-text-blue">MY</span>{' '}
            <span className="text-primary glow-text-red">BOOKINGS</span>
          </h1>
          <p className="text-muted-foreground font-exo">
            Track your galactic adventures and upcoming stays
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover-lift bg-card/95 backdrop-blur-sm border-border">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-48 flex-shrink-0">
                    <img 
                      src={booking.room?.image_urls?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'} 
                      alt={booking.room?.name || 'Room'}
                      className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-orbitron font-bold text-foreground mb-1">
                          {booking.room?.name || 'Room Details Loading...'}
                        </h3>
                        <div className="flex items-center text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="font-exo text-sm">{booking.room?.location || 'Location Loading...'}</span>
                        </div>
                      </div>
                      
                      <Badge className={`${getStatusColor(booking.status)} font-exo`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    
                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <div className="font-exo text-sm">
                          <div>Check-in: {formatDate(booking.check_in)}</div>
                          <div>Check-out: {formatDate(booking.check_out)}</div>
                        </div>
                      </div>
                      
                      <div className="font-exo text-sm text-muted-foreground">
                        <div>Booking ID: #{booking.id.slice(0, 8)}</div>
                        <div>Booked: {formatDate(booking.created_at)}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-orbitron font-bold text-primary">
                          ${booking.total_price}
                        </div>
                        <div className="text-sm text-muted-foreground font-exo">
                          Total Amount
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/rooms/${booking.room_id}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-border hover:border-accent hover:text-accent font-exo"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Room
                        </Button>
                      </Link>
                      {booking.status === 'confirmed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-border hover:border-primary hover:text-primary font-exo"
                        >
                          Modify Booking
                        </Button>
                      )}
                      {booking.status === 'pending' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="font-exo"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="death-star-loader mx-auto opacity-30" />
            </div>
            <h3 className="text-xl font-orbitron font-bold text-muted-foreground mb-2">
              No Bookings Found
            </h3>
            <p className="text-muted-foreground font-exo mb-6">
              You haven't made any bookings yet. Start exploring the galaxy!
            </p>
            <Link to="/">
              <Button className="lightsaber-button bg-primary hover:bg-primary/90 text-primary-foreground font-exo font-semibold">
                Start Booking
              </Button>
            </Link>
          </div>
        )}

        {/* Stripe Integration Notice */}
        <Card className="bg-card/95 backdrop-blur-sm border-accent/30 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-accent mb-2">
                  Stripe Payment Integration Active
                </h3>
                <p className="text-muted-foreground font-exo mb-4">
                  Your bookings are now processed through Stripe for secure payments. 
                  All booking and payment data is stored in Supabase with proper security policies.
                </p>
                <div className="text-sm text-muted-foreground font-exo">
                  <p>✅ Secure payment processing</p>
                  <p>✅ Real-time booking confirmations</p>
                  <p>✅ Webhook-based status updates</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Bookings;