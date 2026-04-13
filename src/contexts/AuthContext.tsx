import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "admin" | "contador" | "emissor";

export interface User {
  id: string;
  nome: string;
  usuario: string;
  role: UserRole;
  empresa?: string;
  id_contador?: string;
  id_empresa?: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const DEMO_EMAILS: Record<string, string> = {
  admin: "admin@xfiscal.com",
  contador: "contador@xfiscal.com",
  emissor: "emissor@xfiscal.com",
};

async function fetchUserRole(userId: string): Promise<UserRole> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .limit(1)
    .single();
  return (data?.role as UserRole) || "emissor";
}

async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

async function fetchAccountantId(userId: string): Promise<string | undefined> {
  const { data } = await supabase
    .from("accountants")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .single();
  return data?.id;
}

async function fetchCompanyInfo(userId: string): Promise<{ id?: string; nome?: string; accountant_id?: string }> {
  const { data } = await supabase
    .from("companies")
    .select("id, razao_social, accountant_id")
    .eq("user_id", userId)
    .limit(1)
    .single();
  return data ? { id: data.id, nome: data.razao_social, accountant_id: data.accountant_id } : {};
}

async function buildUser(supabaseUser: SupabaseUser): Promise<User> {
  const [role, profile] = await Promise.all([
    fetchUserRole(supabaseUser.id),
    fetchProfile(supabaseUser.id),
  ]);

  const base: User = {
    id: supabaseUser.id,
    nome: profile?.nome || supabaseUser.email || "",
    usuario: supabaseUser.email?.split("@")[0] || "",
    role,
  };

  if (role === "contador") {
    const accId = await fetchAccountantId(supabaseUser.id);
    if (accId) base.id_contador = accId;
  } else if (role === "emissor") {
    const company = await fetchCompanyInfo(supabaseUser.id);
    if (company.id) {
      base.id_empresa = company.id;
      base.empresa = company.nome;
      base.id_contador = company.accountant_id;
    }
  }

  return base;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        // Use setTimeout to avoid blocking the auth state change callback
        setTimeout(async () => {
          try {
            const u = await buildUser(session.user);
            if (mounted) { setUser(u); setLoading(false); }
          } catch (err) {
            console.error("Error building user:", err);
            if (mounted) setLoading(false);
          }
        }, 0);
      } else {
        setSupabaseUser(null);
        setUser(null);
        if (mounted) setLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        try {
          const u = await buildUser(session.user);
          if (mounted) { setUser(u); setLoading(false); }
        } catch (err) {
          console.error("Error building user:", err);
          if (mounted) setLoading(false);
        }
      } else {
        if (mounted) setLoading(false);
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const login = useCallback(async (usuario: string, senha: string) => {
    const email = DEMO_EMAILS[usuario] || (usuario.includes("@") ? usuario : `${usuario}@xfiscal.com`);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      console.error("Login error:", error.message);
      return false;
    }
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, supabaseUser, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
