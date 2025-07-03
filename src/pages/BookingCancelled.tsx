import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';

const BookingCancelled = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Cancelled Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-2">
              <span className="text-red-400">BOOKING</span>{' '}
              <span className="text-muted-foreground">CANCELLED</span>
            </h1>
            <p className="text-muted-foreground font-exo text-lg">
              Your booking was cancelled and no payment was processed.
            </p>
          </div>

          {/* Information Card */}
          <Card className="bg-card/95 backdrop-blur-sm border-border mb-6">
            <CardHeader>
              <CardTitle className="font-orbitron text-foreground">
                What Happened?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground font-exo">
                Your booking process was interrupted and no charges were made to your payment method. 
                This can happen if:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground font-exo">
                <li>You clicked the back button during payment</li>
                <li>The payment session expired</li>
                <li>There was a network connection issue</li>
                <li>You chose to cancel the booking</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link to="/" className="flex-1">
              <Button 
                className="w-full lightsaber-button bg-primary hover:bg-primary/90 text-primary-foreground font-exo font-semibold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Booking Again
              </Button>
            </Link>
            
            <Link to="/" className="flex-1">
              <Button 
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground font-exo font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse Other Rooms
              </Button>
            </Link>
          </div>

          {/* Help Card */}
          <Card className="bg-card/95 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <h3 className="font-orbitron font-bold text-foreground mb-2">
                Need Assistance?
              </h3>
              <p className="text-muted-foreground font-exo mb-4">
                If you're experiencing issues with booking or have questions about our accommodations, 
                our support team is ready to help.
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

export default BookingCancelled;