// import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { User, Session } from '@supabase/supabase-js';
// import { supabase } from '@/integrations/supabase/client';

// interface AuthContextType {
//   user: User | null;
//   session: Session | null;
//   userRole: string | null;
//   isLoading: boolean;
//   signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
//   signIn: (email: string, password: string) => Promise<{ error: any }>;
//   signOut: () => Promise<void>;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   session: null,
//   userRole: null,
//   isLoading: true,
//   signUp: async () => ({ error: null }),
//   signIn: async () => ({ error: null }),
//   signOut: async () => {},
//   loading: isLoading,
// });

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const cleanupAuthState = () => {
//     // Clear all auth-related localStorage items
//     Object.keys(localStorage).forEach((key) => {
//       if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
//         localStorage.removeItem(key);
//       }
//     });
//   };

//   const fetchUserRole = async (userId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('user_roles')
//         .select('role')
//         .eq('user_id', userId)
//         .single();
      
//       if (!error && data) {
//         setUserRole(data.role);
//       }
//     } catch (error) {
//       console.error('Error fetching user role:', error);
//     }
//   };

//   useEffect(() => {
//     // Set up auth state listener first
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setSession(session);
//         setUser(session?.user ?? null);
        
//         if (session?.user) {
//           // Defer role fetching to prevent deadlocks
//           setTimeout(() => {
//             fetchUserRole(session.user.id);
//           }, 0);
//         } else {
//           setUserRole(null);
//         }
        
//         setIsLoading(false);
//       }
//     );

//     // Then check for existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       if (session?.user) {
//         fetchUserRole(session.user.id);
//       }
//       setIsLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signUp = async (email: string, password: string, displayName?: string) => {
//     try {
//       cleanupAuthState();
      
//       const redirectUrl = `${window.location.origin}/`;
      
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: redirectUrl,
//           data: displayName ? { display_name: displayName } : {}
//         }
//       });
      
//       return { error };
//     } catch (error) {
//       return { error };
//     }
//   };

//   const signIn = async (email: string, password: string) => {
//     try {
//       cleanupAuthState();
      
//       try {
//         await supabase.auth.signOut({ scope: 'global' });
//       } catch (err) {
//         // Continue even if this fails
//       }
      
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
      
//       if (error) return { error };
      
//       if (data.user) {
//         // Force page reload for clean state
//         window.location.href = '/';
//       }
      
//       return { error: null };
//     } catch (error) {
//       return { error };
//     }
//   };

//   const signOut = async () => {
//     try {
//       cleanupAuthState();
      
//       try {
//         await supabase.auth.signOut({ scope: 'global' });
//       } catch (err) {
//         // Ignore errors
//       }
      
//       window.location.href = '/auth';
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const value = {
//     user,
//     session,
//     userRole,
//     isLoading,
//     signUp,
//     signIn,
//     signOut,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };




// import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { User, Session } from '@supabase/supabase-js';
// import { supabase } from '@/integrations/supabase/client';

// interface AuthContextType {
//   user: User | null;
//   session: Session | null;
//   userRole: string | null;
//   isLoading: boolean;
//   signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
//   signIn: (email: string, password: string) => Promise<{ error: any }>;
//   signOut: () => Promise<void>;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   session: null,
//   userRole: null,
//   isLoading: true,
//   signUp: async () => ({ error: null }),
//   signIn: async () => ({ error: null }),
//   signOut: async () => {},
//   loading: true, // <--- แก้จุดที่ 1: ใส่ค่า true ไปเลย (เดิม error เพราะหาตัวแปร isLoading ไม่เจอ)
// });

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const cleanupAuthState = () => {
//     // Clear all auth-related localStorage items
//     Object.keys(localStorage).forEach((key) => {
//       if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
//         localStorage.removeItem(key);
//       }
//     });
//   };

//   const fetchUserRole = async (userId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('user_roles')
//         .select('role')
//         .eq('user_id', userId)
//         .single();
      
//       if (!error && data) {
//         setUserRole(data.role);
//       }
//     } catch (error) {
//       console.error('Error fetching user role:', error);
//     }
//   };

//   useEffect(() => {
//     // Set up auth state listener first
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setSession(session);
//         setUser(session?.user ?? null);
        
//         if (session?.user) {
//           // Defer role fetching to prevent deadlocks
//           setTimeout(() => {
//             fetchUserRole(session.user.id);
//           }, 0);
//         } else {
//           setUserRole(null);
//         }
        
//         setIsLoading(false);
//       }
//     );

//     // Then check for existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       if (session?.user) {
//         fetchUserRole(session.user.id);
//       }
//       setIsLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signUp = async (email: string, password: string, displayName?: string) => {
//     try {
//       cleanupAuthState();
      
//       const redirectUrl = `${window.location.origin}/`;
      
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: redirectUrl,
//           data: displayName ? { display_name: displayName } : {}
//         }
//       });
      
//       return { error };
//     } catch (error) {
//       return { error };
//     }
//   };

//   const signIn = async (email: string, password: string) => {
//     try {
//       cleanupAuthState();
      
//       try {
//         await supabase.auth.signOut({ scope: 'global' });
//       } catch (err) {
//         // Continue even if this fails
//       }
      
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
      
//       if (error) return { error };
      
//       if (data.user) {
//         // Force page reload for clean state
//         window.location.href = '/';
//       }
      
//       return { error: null };
//     } catch (error) {
//       return { error };
//     }
//   };

//   const signOut = async () => {
//     try {
//       cleanupAuthState();
      
//       try {
//         await supabase.auth.signOut({ scope: 'global' });
//       } catch (err) {
//         // Ignore errors
//       }
      
//       window.location.href = '/auth';
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const value = {
//     user,
//     session,
//     userRole,
//     isLoading,
//     signUp,
//     signIn,
//     signOut,
//     loading: isLoading, // <--- แก้จุดที่ 2: เพิ่ม loading เข้าไปโดยดึงค่าจาก isLoading
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };




import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  isLoading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  isLoading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  loading: true, 
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // 1. ดึง Session ปัจจุบัน
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // 2. ถ้ามี User ให้ดึง Role ต่อทันที
          if (session?.user) {
            await fetchUserRole(session.user.id);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        // 3. เสร็จทุกขั้นตอนแล้วค่อยหยุด Loading
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listener สำหรับการเปลี่ยนแปลง Auth (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
             // ใช้ setTimeout เล็กน้อยเพื่อให้แน่ใจว่า Session เสถียร
             setTimeout(() => fetchUserRole(session.user.id), 0);
          } else {
             setUserRole(null);
          }
          
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      cleanupAuthState();
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: displayName ? { display_name: displayName } : {}
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: 'global' }); } catch (err) {}
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) return { error };
      
      if (data.user) {
        window.location.href = '/';
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: 'global' }); } catch (err) {}
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    userRole,
    isLoading,
    signUp,
    signIn,
    signOut,
    loading: isLoading, // ส่งค่า loading ออกไปใช้งาน
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};