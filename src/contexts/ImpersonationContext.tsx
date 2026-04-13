import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface ImpersonationTarget {
  id: string;
  name: string;
  role: UserRole;
  /** For contador impersonation, the accountant record id */
  accountantId?: string;
  /** For empresa impersonation, the company record id */
  companyId?: string;
}

interface ImpersonationContextType {
  /** The impersonation stack (supports admin→contador→empresa) */
  stack: ImpersonationTarget[];
  /** Current impersonation target (top of stack), or null */
  current: ImpersonationTarget | null;
  /** The effective role the UI should render */
  effectiveRole: UserRole;
  /** The effective accountant id for data fetching */
  effectiveAccountantId?: string;
  /** The effective company id for data fetching */
  effectiveCompanyId?: string;
  /** Enter a contador's context (admin only) */
  enterContador: (id: string, name: string) => void;
  /** Enter an empresa's context (admin or contador) */
  enterEmpresa: (id: string, name: string, accountantId?: string) => void;
  /** Go back one level */
  goBack: () => void;
  /** Whether currently impersonating */
  isImpersonating: boolean;
}

const ImpersonationContext = createContext<ImpersonationContextType>({} as ImpersonationContextType);

export const ImpersonationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [stack, setStack] = useState<ImpersonationTarget[]>([]);

  const current = stack.length > 0 ? stack[stack.length - 1] : null;

  const effectiveRole: UserRole = current?.role || user?.role || "emissor";

  const effectiveAccountantId = current?.role === "contador"
    ? current.accountantId
    : current?.role === "emissor"
      ? (stack.length >= 2 ? stack[stack.length - 2].accountantId : undefined)
      : user?.id_contador;

  const effectiveCompanyId = current?.role === "emissor"
    ? current.companyId
    : user?.id_empresa;

  const enterContador = useCallback((id: string, name: string) => {
    if (user?.role !== "admin") return;
    setStack([{ id, name, role: "contador", accountantId: id }]);
  }, [user?.role]);

  const enterEmpresa = useCallback((id: string, name: string, accountantId?: string) => {
    setStack(prev => [
      ...prev,
      { id, name, role: "emissor", companyId: id, accountantId }
    ]);
  }, []);

  const goBack = useCallback(() => {
    setStack(prev => prev.slice(0, -1));
  }, []);

  return (
    <ImpersonationContext.Provider value={{
      stack,
      current,
      effectiveRole,
      effectiveAccountantId,
      effectiveCompanyId,
      enterContador,
      enterEmpresa,
      goBack,
      isImpersonating: stack.length > 0,
    }}>
      {children}
    </ImpersonationContext.Provider>
  );
};

export const useImpersonation = () => useContext(ImpersonationContext);
