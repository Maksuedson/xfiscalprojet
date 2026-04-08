import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "./AdminDashboard";
import ContadorDashboard from "./ContadorDashboard";
import EmissorDashboard from "./EmissorDashboard";

const DashboardHome = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "admin": return <AdminDashboard />;
    case "contador": return <ContadorDashboard />;
    case "emissor": return <EmissorDashboard />;
    default: return <AdminDashboard />;
  }
};

export default DashboardHome;
