# 🌟 Starbase Stays - Enhanced Galactic Room Booking Platform

A professional Star Wars-themed room booking web application built with modern technologies for an immersive user experience, featuring real Supabase data integration and authentication.

## 🚀 Features

### Core Functionality
- **30 Unique Room Listings**: Real data fetched from Supabase database
- **Advanced Search & Filtering**: Filter by price, location, amenities, room type, and guest count
- **Room Details Page**: Comprehensive room information with image carousel and booking interface
- **User Authentication**: Email/password and Google OAuth via Supabase Auth
- **Profile Management**: User profiles with booking history and preferences
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile devices

### Star Wars Theme
- **Professional Dark Theme**: Black background (#1A1A1A), deep red accents (#8B0000), electric blue highlights (#00B7EB)
- **Futuristic Fonts**: Orbitron and Exo 2 from Google Fonts
- **Lightsaber Buttons**: Glowing red and blue buttons with hover effects
- **Death Star Loading**: Custom CSS animations for loading states
- **Starfield Background**: Subtle animated starfield background
- **Sound Effects**: Optional lightsaber sound effects with toggle

### Technical Features
- **Real-time Authentication**: Proper auth state management with Supabase
- **Database Integration**: PostgreSQL with Row Level Security (RLS)
- **Performance Optimized**: Lazy loading, efficient queries, and minimal animations
- **Accessibility**: High contrast, ARIA labels, and keyboard navigation

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Star Wars theme
- **UI Components**: Shadcn-UI with custom variants
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router DOM
- **State Management**: React hooks + TanStack Query
- **Icons**: Lucide React

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Supabase account and project

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd starbase-stays
npm install
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

#### Set Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Run Database Migrations
1. In your Supabase dashboard, go to SQL Editor
2. Run the migration file `supabase/migrations/create_rooms_table.sql`
3. This will create the rooms table and insert 30 sample accommodations

#### Configure Authentication
1. In Supabase dashboard, go to Authentication > Settings
2. Add your site URL (e.g., `http://localhost:8080`) to "Site URL"
3. For Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 3. Start Development Server
```bash
npm run dev
```

Navigate to `http://localhost:8080`

## 🗃 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── Header.tsx      # Navigation with auth state
│   ├── SearchBar.tsx   # Galactic search console
│   ├── RoomCard.tsx    # Room listing cards
│   ├── FiltersSidebar.tsx # Advanced filters
│   └── LoadingSpinner.tsx # Death Star loader
├── pages/
│   ├── Browse.tsx      # Main room browsing page
│   ├── RoomDetails.tsx # Individual room details
│   ├── Auth.tsx        # Login/signup page
│   ├── Profile.tsx     # User profile page
│   ├── Bookings.tsx    # User bookings page
│   └── NotFound.tsx    # 404 error page
├── lib/
│   ├── auth.ts         # Authentication utilities
│   └── supabase-rooms.ts # Room data functions
├── hooks/
│   ├── useAuth.ts      # Authentication hook
│   └── use-toast.ts    # Toast notifications
├── integrations/
│   └── supabase/       # Supabase client and types
└── index.css           # Global styles and Star Wars theme
```

## 🎨 Design System

### Color Palette
- **Background**: Deep space black (#1A1A1A)
- **Primary**: Deep red (#8B0000) for Sith-inspired elements
- **Accent**: Electric blue (#00B7EB) for Jedi-inspired elements
- **Text**: Pure white (#FFFFFF) with gray variants
- **Cards**: Very dark (#0A0A0A) with transparency

### Typography
- **Display**: Orbitron (futuristic, headers)
- **Body**: Exo 2 (readable, content)

### Components
- **Lightsaber Buttons**: Glowing borders with hover effects
- **Death Star Loader**: Rotating sphere with red laser
- **Hover Effects**: Scale and glow transformations
- **Starfield**: CSS-only animated background

## 🔧 Database Schema

### Rooms Table
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  description TEXT,
  image_urls TEXT[] DEFAULT '{}',
  room_type TEXT DEFAULT 'hotel',
  max_guests INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Sample Data
The database includes 30 unique Star Wars-themed accommodations:
- Jedi Suite (Hilton Downtown) - Coruscant District (New York, NY)
- Bounty Hunter Bunk (Urban Loft) - Tatooine Outskirts (Los Angeles, CA)
- Sith Sanctuary (Marriott Elite) - Mustafar Quarter (Chicago, IL)
- And 27 more unique listings...

## 🔐 Authentication Features

### Supported Methods
- Email/password authentication
- Google OAuth
- Automatic profile creation
- Session persistence

### Auth State Management
- Real-time auth state updates
- Proper loading states
- Automatic redirects
- User display name handling

### Protected Routes
- Profile page requires authentication
- Bookings page requires authentication
- Automatic redirect to login when needed

## 🎮 Features Guide

### Search & Filtering
- **Location Search**: Filter by city or planet names
- **Date Selection**: Check-in/out date picker (UI only)
- **Guest Count**: Filter by number of travelers
- **Price Range**: Min/max price filters
- **Amenities**: Multi-select amenity filtering
- **Room Type**: Hotel, apartment, or suite

### Room Details
- **Image Carousel**: Multiple room images with navigation
- **Comprehensive Info**: Full descriptions, amenities, ratings
- **Booking Interface**: Date selection and price calculation
- **Responsive Layout**: Optimized for all screen sizes

### User Experience
- **Sound Effects**: Optional lightsaber sounds with toggle
- **Loading States**: Death Star spinner for all async operations
- **Toast Notifications**: Feedback for all user actions
- **Keyboard Navigation**: Full accessibility support

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Real booking system with payments (Stripe integration)
- [ ] User reviews and ratings system
- [ ] Admin dashboard for room management
- [ ] Email notifications for bookings
- [ ] Calendar integration and availability
- [ ] Advanced search with maps
- [ ] Wishlist/favorites functionality

### Technical Improvements
- [ ] Progressive Web App (PWA)
- [ ] Image optimization with Supabase Storage
- [ ] Internationalization (i18n)
- [ ] Performance monitoring
- [ ] Unit and integration tests
- [ ] Real-time chat support

## 🎯 Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and semantic HTML
- **High Contrast**: Color combinations meet WCAG standards
- **Focus Indicators**: Visible focus states
- **Alt Text**: Descriptive image alt text
- **Loading States**: Clear feedback for async operations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is for educational purposes. Star Wars theme elements are inspired by but not copied from copyrighted material.

## 🙏 Credits

- **UI Framework**: [Shadcn-UI](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Images**: [Unsplash](https://unsplash.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)

## 🔧 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify environment variables are set correctly
   - Check Supabase project URL and anon key
   - Ensure RLS policies are properly configured

2. **Authentication Not Working**
   - Check site URL in Supabase Auth settings
   - Verify OAuth provider configuration
   - Clear browser cache and localStorage

3. **Images Not Loading**
   - Check image URLs in database
   - Verify CORS settings if using custom images
   - Ensure image URLs are accessible

4. **Build Errors**
   - Run `npm install` to ensure all dependencies
   - Check TypeScript errors with `npm run build`
   - Verify environment variables for production

---

**May the Force be with your bookings! 🌟**

Built with ❤️ using modern web technologies and the power of the Force.