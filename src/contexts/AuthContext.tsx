import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase, Profile, UserRole } from "@/lib/supabase";

interface AuthContextType {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    company?: string;
    bio?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function constructProfileFromUser(user: SupabaseUser): Profile {
  return {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.name || "",
    role: user.user_metadata?.role || "jobseeker",
    bio: user.user_metadata?.bio || null,
    company: user.user_metadata?.company || null,
    resume_url: user.user_metadata?.resume_url || null,
    created_at: user.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount and listen for changes
  useEffect(() => {
    // Get existing session (fast, reads from local storage)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUser(constructProfileFromUser(session.user));
      }
      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUser(constructProfileFromUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    company?: string;
    bio?: string;
  }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role,
          company: data.company ?? null,
          bio: data.bio ?? null,
        },
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Re-export UserRole for backward compat
export type { UserRole };
