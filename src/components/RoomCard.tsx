import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Star, MapPin, Users, Wifi, Car, Utensils } from 'lucide-react';
import { Room } from '@/data/rooms';

interface RoomCardProps {
  room: Room;
  onBook: (roomId: string) => void;
  playSound?: () => void;
}

const RoomCard = ({ room, onBook, playSound }: RoomCardProps) => {
  const handleBookClick = () => {
    if (playSound) playSound();
    onBook(room.id);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wi-fi':
        return <Wifi className="w-3 h-3" />;
      case 'parking':
        return <Car className="w-3 h-3" />;
      case 'breakfast':
        return <Utensils className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getThemeColor = () => {
    if (room.name.toLowerCase().includes('jedi')) return 'jedi';
    if (room.name.toLowerCase().includes('sith')) return 'sith';
    if (room.name.toLowerCase().includes('rebel')) return 'rebel';
    if (room.name.toLowerCase().includes('imperial')) return 'empire';
    return 'primary';
  };

  const themeColor = getThemeColor();

  return (
    <Card className="hover-lift bg-card/95 backdrop-blur-sm border-border overflow-hidden group">
      <CardHeader className="p-0 relative">
        <div className="relative overflow-hidden">
          <img 
            src={room.image} 
            alt={room.name}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge 
              variant="secondary" 
              className="bg-background/90 text-foreground font-exo"
            >
              ${room.price}/night
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-xl font-orbitron font-bold text-white glow-text-red">
              {room.name}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Location */}
        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2 text-primary" />
          <span className="font-exo text-sm">{room.location}</span>
        </div>

        {/* Rating and Guests */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="font-exo font-semibold">{room.rating}</span>
            <span className="text-muted-foreground font-exo text-sm ml-1">/5</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            <span className="font-exo text-sm">Up to {room.maxGuests}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground font-exo line-clamp-2">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1">
          {room.amenities.slice(0, 3).map((amenity) => (
            <Badge 
              key={amenity} 
              variant="outline" 
              className="text-xs font-exo border-border flex items-center gap-1"
            >
              {getAmenityIcon(amenity)}
              {amenity}
            </Badge>
          ))}
          {room.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs font-exo border-border">
              +{room.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleBookClick}
          className={`w-full lightsaber-button font-exo font-semibold transition-all duration-300 ${
            themeColor === 'jedi' ? 'lightsaber-button-blue bg-accent hover:bg-accent/90 text-accent-foreground' :
            themeColor === 'sith' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' :
            themeColor === 'rebel' ? 'bg-rebel hover:bg-rebel/90 text-white' :
            themeColor === 'empire' ? 'bg-empire hover:bg-empire/90 text-white' :
            'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;