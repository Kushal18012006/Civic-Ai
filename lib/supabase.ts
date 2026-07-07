import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured = supabaseUrl.trim().length > 0 && supabaseAnonKey.trim().length > 0;

// Standard Supabase client instance (only if credentials exist)
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage session keys
const SESSION_KEY = 'civicai-session';
const USERS_DB_KEY = 'civicai-users-db';

interface MockUser {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
}

interface MockSession {
  user: MockUser | null;
  expires_at?: number;
}

// High-fidelity client-side fallback for Supabase Auth & Database
export const mockSupabase = {
  auth: {
    signUp: async ({ email, password, options }: { email: string; password: string; options?: { data?: Record<string, unknown> } }) => {
      await new Promise(r => setTimeout(r, 600));
      
      const usersRaw = localStorage.getItem(USERS_DB_KEY);
      const users: Record<string, { password: string; user: MockUser }> = usersRaw ? JSON.parse(usersRaw) : {};
      
      if (users[email]) {
        return { data: { user: null }, error: { message: "User already exists." } };
      }

      const id = 'usr_' + Math.random().toString(36).substr(2, 9);
      const newUser = {
        id,
        email,
        user_metadata: options?.data || {}
      };

      users[email] = { password, user: newUser };
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

      // Auto-login on sign up
      const session = { user: newUser };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      // Trigger auth event manually
      window.dispatchEvent(new Event('civicai-auth-change'));

      return { data: { user: newUser, session }, error: null };
    },

    signInWithPassword: async ({ email, password }: Record<string, string>) => {
      await new Promise(r => setTimeout(r, 600));

      const usersRaw = localStorage.getItem(USERS_DB_KEY);
      const users: Record<string, { password: string; user: MockUser }> = usersRaw ? JSON.parse(usersRaw) : {};
      
      // Auto-seed/update the demo account on-demand on sign-in
      const demoEmail = 'kushal.tripathi@civicai.gov';
      if (email === demoEmail) {
        users[email] = {
          password: 'demopass123',
          user: {
            id: 'usr_demo_123',
            email: demoEmail,
            user_metadata: {
              name: 'Kushal Tripathi',
              age: 20,
              occupation: 'Freelance Software Developer',
              income: 200000,
              location: 'Metropolis City, Ward 12',
              education: 'Bachelor of Science in Computer Science',
              language: 'en'
            }
          }
        };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      }

      const record = users[email];
      if (!record || record.password !== password) {
        return { data: { user: null, session: null }, error: { message: "Invalid email or password." } };
      }

      const session = { user: record.user };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      window.dispatchEvent(new Event('civicai-auth-change'));

      return { data: { user: record.user, session }, error: null };
    },

    signOut: async () => {
      await new Promise(r => setTimeout(r, 300));
      localStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new Event('civicai-auth-change'));
      return { error: null };
    },

    getUser: async () => {
      const sessionRaw = localStorage.getItem(SESSION_KEY);
      if (!sessionRaw) return { data: { user: null }, error: null };
      const session = JSON.parse(sessionRaw) as MockSession;
      return { data: { user: session.user }, error: null };
    },

    getSession: async () => {
      const sessionRaw = localStorage.getItem(SESSION_KEY);
      if (!sessionRaw) return { data: { session: null }, error: null };
      const session = JSON.parse(sessionRaw) as MockSession;
      return { data: { session }, error: null };
    },

    onAuthStateChange: (callback: (event: string, session: MockSession | null) => void) => {
      const handleAuthChange = () => {
        const sessionRaw = localStorage.getItem(SESSION_KEY);
        const session = sessionRaw ? JSON.parse(sessionRaw) : null;
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('civicai-auth-change', handleAuthChange);
        // Initial call
        handleAuthChange();
      }

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              if (typeof window !== 'undefined') {
                window.removeEventListener('civicai-auth-change', handleAuthChange);
              }
            }
          }
        }
      };
    }
  }
};

// Unified Auth helper that automatically selects live or mock
export const getAuthClient = () => {
  return isConfigured && supabase ? supabase.auth : mockSupabase.auth;
};
