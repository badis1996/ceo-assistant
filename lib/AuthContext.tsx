'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged
} from 'firebase/auth';
import { auth } from './firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Handle auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      if (!user) {
        // Redirect to login if user is not authenticated
        router.push('/login');
      }
    });

    // Handle token changes (session expiration, etc.)
    const unsubscribeToken = onIdTokenChanged(auth, async (user) => {
      if (user) {
        // Get the ID token for session management
        const token = await user.getIdToken();
        // Store the token in a cookie
        document.cookie = `session=${token}; path=/; max-age=3600; secure; samesite=strict`;
      } else {
        // Clear the session cookie when token is invalid/expired
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        router.push('/login');
      }
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, [router]);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    // Store the token in a cookie
    document.cookie = `session=${token}; path=/; max-age=3600; secure; samesite=strict`;
  };

  const logout = async () => {
    await signOut(auth);
    // Clear the session cookie
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Clear all localStorage data
    localStorage.clear();
    
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 