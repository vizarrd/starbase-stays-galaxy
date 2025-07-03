# 🌟 Starbase Stays - Galactic Room Booking Platform

A Star Wars-themed room booking web application built with modern technologies for an immersive user experience.

## 🚀 Features

- **Galactic Theme**: Dark Star Wars-inspired UI with red lightsaber accents
- **Room Browsing**: Browse accommodations with detailed listings and photos
- **Advanced Search**: Filter by location, dates, guests, and amenities
- **Smart Filtering**: Price range, room type, and amenity filters
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile
- **Sound Effects**: Optional lightsaber sound effects with toggle
- **Accessibility**: High contrast, ARIA labels, and keyboard navigation
- **Death Star Loading**: Custom CSS animations and loading states

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Star Wars theme
- **UI Components**: Shadcn-UI with custom Star Wars variants
- **Routing**: React Router DOM
- **State Management**: React hooks
- **Icons**: Lucide React
- **Fonts**: Orbitron + Exo 2 (Google Fonts)

## 🎨 Design System

### Color Palette
- **Background**: Pure black (#000000) space theme
- **Primary**: Sith Red (#FF0000) for CTAs and highlights
- **Accent**: Jedi Blue (#3B82F6) for secondary actions
- **Text**: Pure white (#FFFFFF) with gray variants
- **Cards**: Dark gray (#0A0A0A) with transparency

### Typography
- **Display**: Orbitron (futuristic, headers)
- **Body**: Exo 2 (readable, content)

### Effects
- **Glowing borders**: CSS box-shadow for lightsaber effects
- **Hover animations**: Transform scale and shadow effects
- **Loading spinner**: Death Star rotating animation
- **Starfield background**: CSS-only animated starfield

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Local Development

1. **Clone and install dependencies**:
```bash
git clone <your-repo-url>
cd starbase-stays
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open in browser**:
Navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
npm run preview
```

## 🗃 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── Header.tsx      # Navigation header
│   ├── SearchBar.tsx   # Galactic search console
│   ├── RoomCard.tsx    # Room listing cards
│   ├── FiltersSidebar.tsx # Jedi controls sidebar
│   ├── LoadingSpinner.tsx # Death Star loader
│   └── SoundToggle.tsx # Sound effects toggle
├── data/
│   └── rooms.ts        # Mock room data and types
├── pages/
│   ├── Browse.tsx      # Main room browsing page
│   ├── Bookings.tsx    # User bookings page
│   └── NotFound.tsx    # 404 error page
├── hooks/
│   └── use-toast.ts    # Toast notifications
├── lib/
│   └── utils.ts        # Utility functions
└── index.css           # Global styles and design system
```

## 🔧 Configuration

### Environment Variables
Currently no environment variables required for frontend-only version.

### Supabase Integration (Recommended)
For full functionality including authentication and data persistence:

1. **Create Supabase project**: [supabase.com](https://supabase.com)
2. **Connect in Lovable**: Click the green Supabase button in Lovable interface
3. **Set up database tables**:
   - `rooms` - Room listings
   - `bookings` - User bookings
   - `users` - User profiles

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`

### Manual Deployment
1. Run `npm run build`
2. Upload `dist/` folder to your web server

## 🎮 Features Guide

### Sound Effects
- Toggle sound on/off with speaker icon
- Lightsaber sound on button clicks
- Preference saved in localStorage

### Search & Filtering
- **Location search**: Type city names to filter
- **Date selection**: Check-in/out date picker
- **Guest count**: Select number of travelers
- **Price range**: Min/max price filters
- **Amenities**: Multi-select amenity filtering
- **Room type**: Hotel, apartment, or suite

### Responsive Design
- **Desktop**: Full sidebar with grid layout
- **Tablet**: Collapsible sidebar with responsive grid
- **Mobile**: Bottom sheet filters with single column

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] User authentication (Supabase Auth)
- [ ] Real booking system with payments
- [ ] User reviews and ratings
- [ ] Admin dashboard for room management
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Advanced search with maps

### Technical Improvements
- [ ] Progressive Web App (PWA)
- [ ] Image optimization and lazy loading
- [ ] Internationalization (i18n)
- [ ] Performance monitoring
- [ ] Unit and integration tests

## 🎯 Accessibility

- **Keyboard navigation**: Full keyboard support
- **Screen readers**: ARIA labels and semantic HTML
- **High contrast**: Color combinations meet WCAG standards
- **Focus indicators**: Visible focus states
- **Alt text**: Descriptive image alt text

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
- **Icons**: [Lucide React](https://lucide.dev/)
- **Images**: [Unsplash](https://unsplash.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)

---

**May the Force be with your bookings! 🌟**

Built with ❤️ using Lovable and the power of the Force.