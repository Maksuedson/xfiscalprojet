import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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
  isAuthenticated: boolean;
  login: (usuario: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Demo users for the SaaS showcase
const DEMO_USERS: Record<string, { senha: string; user: User }> = {
  admin: {
    senha: "admin123",
    user: { id: "1", nome: "Administrador", usuario: "admin", role: "admin" },
  },
  contador: {
    senha: "contador123",
    user: { id: "2", nome: "João Silva Contabilidade", usuario: "contador", role: "contador", id_contador: "1" },
  },
  emissor: {
    senha: "emissor123",
    user: { id: "3", nome: "Tech Solutions LTDA", usuario: "emissor", role: "emissor", id_contador: "1", id_empresa: "1", empresa: "Tech Solutions LTDA" },
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("xfiscal_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (usuario: string, senha: string) => {
    const entry = DEMO_USERS[usuario];
    if (entry && entry.senha === senha) {
      setUser(entry.user);
      sessionStorage.setItem("xfiscal_user", JSON.stringify(entry.user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("xfiscal_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
