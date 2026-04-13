import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Building2, CheckCircle, Clock, AlertTriangle, ShieldCheck, DollarSign, CreditCard, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useContadorStats, useCompanies, useCompanyCharges } from "@/hooks/useSupabaseData";

const ContadorDashboard = ({ overrideAccountantId }: { overrideAccountantId?: string }) => {
  const { user } = useAuth();
  const accountantId = overrideAccountantId || user?.id_contador;
  const { data: stats, isLoading } = useContadorStats(accountantId);
  const { data: companies } = useCompanies(accountantId);
  const { data: charges } = useCompanyCharges(accountantId);

  const s = stats || { totalEmpresas: 0, empresasAtivas: 0, empresasBloqueadas: 0, certVencendo: 0, chargesPagas: 0, chargesPendentes: 0, chargesVencidas: 0, receitaMes: 0, totalCerts: 0 };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const ultimasEmpresas = (companies || []).slice(0, 5).map((c: any) => ({
    empresa: c.nome_fantasia || c.razao_social,
    status: c.status,
    id: c.id,
  }));

  const ultimasCobrancas = (charges || []).slice(0, 5).map((c: any) => ({
    empresa: c.companies?.nome_fantasia || c.companies?.razao_social || "-",
    competencia: c.competencia,
    valor: `R$ ${Number(c.valor).toFixed(2).replace(".", ",")}`,
    status: c.status,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Painel do Contador</h1>
        <p className="text-muted-foreground">Visão geral da sua carteira de empresas</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <StatCard title="Empresas" value={s.totalEmpresas} icon={Building2} color="primary" />
        <StatCard title="Ativas" value={s.empresasAtivas} icon={CheckCircle} color="accent" />
        <StatCard title="Bloqueadas" value={s.empresasBloqueadas} icon={XCircle} color="destructive" />
        <StatCard title="Cert. Vencendo" value={s.certVencendo} icon={AlertTriangle} color="warning" />
        <StatCard title="Pagas" value={s.chargesPagas} icon={CheckCircle} color="accent" />
        <StatCard title="Pendentes" value={s.chargesPendentes} icon={Clock} color="warning" />
        <StatCard title="Vencidas" value={s.chargesVencidas} icon={CreditCard} color="destructive" />
        <StatCard title="Receita" value={s.receitaMes} prefix="R$ " icon={DollarSign} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Empresas da Carteira</h3>
            <Link to="/dashboard/empresas" className="text-xs text-primary hover:underline">Ver todas →</Link>
          </div>
          <DataTable
            columns={[
              { key: "empresa", header: "Empresa" },
              { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "ativa" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
            ]}
            data={ultimasEmpresas}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Últimas Cobranças</h3>
            <Link to="/dashboard/cobrancas-empresas" className="text-xs text-primary hover:underline">Ver todas →</Link>
          </div>
          <DataTable
            columns={[
              { key: "empresa", header: "Empresa" },
              { key: "competencia", header: "Comp." },
              { key: "valor", header: "Valor" },
              { key: "status", header: "Status", render: (r: any) => {
                const c: Record<string, string> = { pago: "bg-accent/10 text-accent", pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", vencido: "bg-destructive/10 text-destructive" };
                return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c[r.status]}`}>{r.status}</span>;
              }},
            ]}
            data={ultimasCobrancas}
          />
        </div>
      </div>
    </div>
  );
};

export default ContadorDashboard;
