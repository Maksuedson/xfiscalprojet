import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Building2, Users, Package, Truck, UserCheck,
  FileText, Receipt, CreditCard, BarChart3, Settings, LogOut,
  Menu, X, ChevronDown, Bell, Search, Shield, ShieldCheck, DollarSign, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "error";
}

const notificationsByRole: Record<UserRole, Notification[]> = {
  admin: [
    { id: "1", title: "Cobrança vencida", description: "PL Assessoria — cobrança de Mar/2026 vencida há 15 dias", time: "Há 2 horas", read: false, type: "error" },
    { id: "2", title: "Novo contador cadastrado", description: "Pedro Lima Assessoria se cadastrou na plataforma", time: "Há 5 horas", read: false, type: "info" },
    { id: "3", title: "Certificado vencendo", description: "2 empresas com certificado A1 vencendo em 30 dias", time: "Há 1 dia", read: false, type: "warning" },
  ],
  contador: [
    { id: "1", title: "Certificado vencendo", description: "Comércio Digital ME — certificado vence em 70 dias", time: "Há 3 horas", read: false, type: "warning" },
    { id: "2", title: "Empresa bloqueada", description: "Import Export SA bloqueada por certificado vencido", time: "Há 1 dia", read: false, type: "error" },
    { id: "3", title: "Cobrança pendente", description: "2 cobranças de empresas pendentes para Abr/2026", time: "Há 2 dias", read: false, type: "info" },
  ],
  emissor: [
    { id: "1", title: "Cobrança pendente", description: "Você tem 2 cobranças pendentes. Pague para evitar bloqueio.", time: "Há 1 dia", read: false, type: "warning" },
    { id: "2", title: "NF-e rejeitada", description: "NF-e 000138 foi rejeitada pela SEFAZ. Verifique os dados.", time: "Há 3 dias", read: false, type: "error" },
    { id: "3", title: "Atualização fiscal", description: "Nova tabela CFOP disponível. Atualize suas configurações.", time: "Há 5 dias", read: false, type: "info" },
  ],
};

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "contador", "emissor"] },
  { label: "Contadores", href: "/dashboard/contadores", icon: UserCheck, roles: ["admin"] },
  { label: "Empresas", href: "/dashboard/empresas", icon: Building2, roles: ["admin", "contador"] },
  { label: "Cobranças Plataforma", href: "/dashboard/cobrancas-plataforma", icon: DollarSign, roles: ["admin"] },
  { label: "Cobranças Empresas", href: "/dashboard/cobrancas-empresas", icon: CreditCard, roles: ["contador"] },
  { label: "Certificados A1", href: "/dashboard/certificados", icon: ShieldCheck, roles: ["contador"] },
  { label: "Clientes", href: "/dashboard/clientes", icon: Users, roles: ["contador", "emissor"] },
  { label: "Produtos", href: "/dashboard/produtos", icon: Package, roles: ["contador", "emissor"] },
  { label: "Fornecedores", href: "/dashboard/fornecedores", icon: Truck, roles: ["contador", "emissor"] },
  { label: "Transportadoras", href: "/dashboard/transportadoras", icon: Truck, roles: ["contador", "emissor"] },
  {
    label: "Notas Fiscais", href: "#", icon: FileText, roles: ["contador", "emissor"],
    children: [
      { label: "NF-e Entrada", href: "/dashboard/nfe/entrada" },
      { label: "NF-e Saída", href: "/dashboard/nfe/saida" },
      { label: "NF-e Devolução", href: "/dashboard/nfe/devolucao" },
      { label: "NFC-e", href: "/dashboard/nfce" },
    ],
  },
  { label: "Cobrança PIX", href: "/dashboard/pix", icon: CreditCard, roles: ["contador"] },
  { label: "Mensalidades", href: "/dashboard/mensalidades", icon: Receipt, roles: ["admin", "contador", "emissor"] },
  { label: "Relatórios", href: "/dashboard/relatorios", icon: BarChart3, roles: ["admin", "contador", "emissor"] },
  { label: "Auditoria", href: "/dashboard/auditoria", icon: Shield, roles: ["admin"] },
  { label: "Configurações", href: "/dashboard/configuracoes", icon: Settings, roles: ["admin", "contador", "emissor"] },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  if (!user) return null;

  const filteredItems = navItems.filter((item) => item.roles.includes(user.role));

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const roleLabel: Record<UserRole, string> = { admin: "Administrador", contador: "Contador", emissor: "Emissor" };
  const roleBadgeColor: Record<UserRole, string> = { admin: "bg-destructive/10 text-destructive", contador: "bg-primary/10 text-primary", emissor: "bg-accent/10 text-accent" };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">xF</span>
          </div>
          {sidebarOpen && <span className="text-lg font-bold text-foreground">xFiscal</span>}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {filteredItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${openSubmenu === item.label ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <item.icon size={18} />
                  {sidebarOpen && (<><span className="flex-1 text-left">{item.label}</span><ChevronDown size={14} className={`transition-transform ${openSubmenu === item.label ? "rotate-180" : ""}`} /></>)}
                </button>
                {openSubmenu === item.label && sidebarOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link key={child.href} to={child.href} onClick={() => setMobileSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive(child.href) ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link to={item.href} onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <item.icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground text-sm font-bold">{user.nome.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.nome}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeColor[user.role]}`}>{roleLabel[user.role]}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}><LogOut size={14} className="mr-2" />Sair</Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {mobileSidebarOpen && <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 z-50 h-full bg-card border-r border-border transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} hidden lg:block`}><SidebarContent /></aside>
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:hidden ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}><SidebarContent /></aside>

      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border h-16 flex items-center px-4 gap-4">
          <button onClick={() => { if (window.innerWidth < 1024) setMobileSidebarOpen(!mobileSidebarOpen); else setSidebarOpen(!sidebarOpen); }} className="text-muted-foreground hover:text-foreground">
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="relative hidden sm:block max-w-sm w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Buscar..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button className="relative text-muted-foreground hover:text-foreground">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">3</span>
          </button>
        </header>
        <main className="p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
};

export default DashboardLayout;
