import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Browse from "./pages/Browse";
import Bookings from "./pages/Bookings";
import Auth from "./pages/Auth";
import RoomDetails from "./pages/RoomDetails";
import Profile from "./pages/Profile";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancelled from "./pages/BookingCancelled";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/booking-cancelled" element={<BookingCancelled />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;