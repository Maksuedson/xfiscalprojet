import { useAuth } from "@/contexts/AuthContext";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import AdminDashboard from "./AdminDashboard";
import ContadorDashboard from "./ContadorDashboard";
import EmissorDashboard from "./EmissorDashboard";

const DashboardHome = () => {
  const { user } = useAuth();
  const { effectiveRole, effectiveAccountantId, effectiveCompanyId } = useImpersonation();

  if (!user) return null;

  switch (effectiveRole) {
    case "admin": return <AdminDashboard />;
    case "contador": return <ContadorDashboard overrideAccountantId={effectiveAccountantId} />;
    case "emissor": return <EmissorDashboard overrideCompanyId={effectiveCompanyId} />;
    default: return <AdminDashboard />;
  }
};

export default DashboardHome;
