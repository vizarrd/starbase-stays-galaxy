import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getAuthState, AuthState } from '@/lib/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const state = await getAuthState();
      setAuthState(state);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setAuthState({ 
          user: session?.user || null, 
          loading: false 
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};