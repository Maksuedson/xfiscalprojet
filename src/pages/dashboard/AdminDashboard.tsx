import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Users, Building2, CheckCircle, Clock, AlertTriangle, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAdminStats, usePlatformCharges, useAccountants } from "@/hooks/useSupabaseData";

const AdminDashboard = () => {
  const { data: stats, isLoading: loadingStats } = useAdminStats();
  const { data: charges } = usePlatformCharges();
  const { data: accountants } = useAccountants();

  const s = stats || { totalContadores: 0, totalEmpresas: 0, contadoresAtivos: 0, chargesPago: 0, chargesPendente: 0, chargesVencido: 0, countPago: 0, countPendente: 0, countVencido: 0, totalCharges: 0 };

  const statusContadores = [
    { name: "Pagos", value: s.countPago, color: "hsl(152, 60%, 45%)" },
    { name: "Pendentes", value: s.countPendente, color: "hsl(45, 93%, 47%)" },
    { name: "Vencidos", value: s.countVencido, color: "hsl(0, 84%, 60%)" },
  ];

  const ultimasCobrancas = (charges || []).slice(0, 5).map((c: any) => ({
    contador: c.accountants?.nome || "-",
    competencia: c.competencia,
    valor: `R$ ${Number(c.valor).toFixed(2).replace(".", ",")}`,
    vencimento: new Date(c.vencimento).toLocaleDateString("pt-BR"),
    status: c.status,
  }));

  const alertas: { tipo: string; msg: string }[] = [];
  if (s.countVencido > 0) alertas.push({ tipo: "vencido", msg: `${s.countVencido} cobrança(s) vencida(s)` });
  if (s.countPendente > 0) alertas.push({ tipo: "pendente", msg: `${s.countPendente} cobrança(s) pendente(s) — R$ ${s.chargesPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` });

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral da plataforma xFiscal</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <StatCard title="Contadores" value={s.totalContadores} icon={Users} color="primary" />
        <StatCard title="Empresas" value={s.totalEmpresas} icon={Building2} color="accent" />
        <StatCard title="Pagos" value={s.countPago} icon={CheckCircle} color="accent" />
        <StatCard title="Pendentes" value={s.countPendente} icon={Clock} color="warning" />
        <StatCard title="Vencidos" value={s.countVencido} icon={AlertTriangle} color="destructive" />
        <StatCard title="Receita Paga" value={s.chargesPago} prefix="R$ " icon={DollarSign} color="primary" />
        <StatCard title="A Receber" value={s.chargesPendente} prefix="R$ " icon={TrendingUp} color="warning" />
        <StatCard title="Cobranças" value={s.totalCharges} icon={CreditCard} color="primary" />
      </div>

      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((a, i) => (
            <div key={i} className={`rounded-xl p-3 flex items-center gap-3 text-sm ${a.tipo === "vencido" ? "bg-destructive/10 border border-destructive/30" : "bg-[hsl(45,93%,47%)]/10 border border-[hsl(45,93%,47%)]/30"}`}>
              <AlertTriangle size={16} className={a.tipo === "vencido" ? "text-destructive" : "text-[hsl(45,93%,47%)]"} />
              <span className="text-foreground">{a.msg}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Últimas Cobranças</h3>
            <Link to="/dashboard/cobrancas-plataforma" className="text-xs text-primary hover:underline">Ver todas →</Link>
          </div>
          <DataTable
            columns={[
              { key: "contador", header: "Contador" },
              { key: "competencia", header: "Comp." },
              { key: "valor", header: "Valor" },
              { key: "vencimento", header: "Venc." },
              { key: "status", header: "Status", render: (r: any) => {
                const c: Record<string, string> = { pago: "bg-accent/10 text-accent", pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", vencido: "bg-destructive/10 text-destructive" };
                return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c[r.status]}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>;
              }},
            ]}
            data={ultimasCobrancas}
          />
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Cobranças por Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusContadores} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                {statusContadores.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {statusContadores.map(s => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: s.color }} /><span className="text-muted-foreground">{s.name}</span></div>
                <span className="font-medium text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Contadores Cadastrados</h3>
          <Link to="/dashboard/contadores" className="text-xs text-primary hover:underline">Ver todos →</Link>
        </div>
        <DataTable
          columns={[
            { key: "nome", header: "Nome" },
            { key: "plano", header: "Plano", render: (r: any) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.plano}</span> },
            { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "ativo" ? "bg-accent/10 text-accent" : r.status === "suspenso" ? "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
          ]}
          data={(accountants || []).slice(0, 5)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
