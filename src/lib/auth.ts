import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export const getAuthState = async (): Promise<AuthState> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return { user: null, loading: false };
    }
    
    return { user: session?.user || null, loading: false };
  } catch (error) {
    console.error('Error in getAuthState:', error);
    return { user: null, loading: false };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

export const getUserDisplayName = (user: User | null): string => {
  if (!user) return '';
  
  // Try to get display name from user metadata
  const displayName = user.user_metadata?.full_name || 
                     user.user_metadata?.name || 
                     user.user_metadata?.display_name;
  
  if (displayName) return displayName;
  
  // Fallback to email username
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'Jedi';
};