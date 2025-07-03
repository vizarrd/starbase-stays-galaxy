export interface Room {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  amenities: string[];
  image: string;
  description: string;
  maxGuests: number;
  type: 'hotel' | 'apartment' | 'suite';
}

export const dummyRooms: Room[] = [
  {
    id: '1',
    name: 'Jedi Suite',
    location: 'Coruscant District, New York',
    price: 150,
    rating: 4.8,
    amenities: ['Wi-Fi', 'Pool', 'Meditation Chamber', 'City View'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&crop=center',
    description: 'A peaceful retreat for Jedi masters and padawans alike. Features a meditation chamber with panoramic city views.',
    maxGuests: 2,
    type: 'suite'
  },
  {
    id: '2',
    name: 'Bounty Hunter Bunk',
    location: 'Tatooine Outskirts, Los Angeles',
    price: 75,
    rating: 4.2,
    amenities: ['Parking', 'Weapon Storage', 'Desert View'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center',
    description: 'Perfect for the traveling bounty hunter. Secure storage for equipment and vehicles included.',
    maxGuests: 1,
    type: 'hotel'
  },
  {
    id: '3',
    name: 'Sith Sanctuary',
    location: 'Mustafar Quarter, Chicago',
    price: 200,
    rating: 4.9,
    amenities: ['Wi-Fi', 'Gym', 'Dark Chamber', 'Lightning View'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center',
    description: 'Embrace the dark side in this luxurious sanctuary. Features a private training chamber and dramatic city views.',
    maxGuests: 2,
    type: 'suite'
  },
  {
    id: '4',
    name: 'Rebel Base',
    location: 'Yavin Hub, Miami',
    price: 120,
    rating: 4.5,
    amenities: ['Wi-Fi', 'Breakfast', 'Command Center', 'Ocean View'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&crop=center',
    description: 'Join the rebellion from this strategic oceanfront location. Includes command center and tactical amenities.',
    maxGuests: 4,
    type: 'apartment'
  },
  {
    id: '5',
    name: "Smuggler's Den",
    location: 'Corellia Bay, San Francisco',
    price: 90,
    rating: 4.3,
    amenities: ['Parking', 'Pet-Friendly', 'Hidden Compartments', 'Bay View'],
    image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=600&fit=crop&crop=center',
    description: 'A discrete hideout with secret compartments and bay views. Perfect for those who need to stay under the radar.',
    maxGuests: 3,
    type: 'apartment'
  },
  {
    id: '6',
    name: 'Imperial Command Suite',
    location: 'Death Star District, Las Vegas',
    price: 300,
    rating: 4.7,
    amenities: ['Wi-Fi', 'Butler Service', 'Hologram Theater', 'Strip View'],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop&crop=center',
    description: 'Rule the galaxy from this opulent Imperial suite. Features hologram theater and personal butler service.',
    maxGuests: 2,
    type: 'suite'
  }
];

export const amenitiesList = [
  'Wi-Fi',
  'Pool', 
  'Gym',
  'Parking',
  'Breakfast',
  'Pet-Friendly',
  'Meditation Chamber',
  'Weapon Storage',
  'Dark Chamber',
  'Command Center',
  'Hidden Compartments',
  'Butler Service',
  'Hologram Theater'
];

export const roomTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'suite', label: 'Suite' }
];