import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Users, Building2, CheckCircle, Clock, AlertTriangle, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const receitaMensal = [
  { mes: "Jan", receita: 12400 }, { mes: "Fev", receita: 13200 }, { mes: "Mar", receita: 14800 },
  { mes: "Abr", receita: 15600 }, { mes: "Mai", receita: 16200 }, { mes: "Jun", receita: 18900 },
  { mes: "Jul", receita: 19500 }, { mes: "Ago", receita: 21200 }, { mes: "Set", receita: 22800 },
  { mes: "Out", receita: 24100 }, { mes: "Nov", receita: 25600 }, { mes: "Dez", receita: 27400 },
];

const statusContadores = [
  { name: "Pagos", value: 28, color: "hsl(152, 60%, 45%)" },
  { name: "Pendentes", value: 7, color: "hsl(45, 93%, 47%)" },
  { name: "Vencidos", value: 3, color: "hsl(0, 84%, 60%)" },
];

const empresasPorContador = [
  { contador: "João Silva", empresas: 12 }, { contador: "Maria Santos", empresas: 8 },
  { contador: "Ana Costa", empresas: 15 }, { contador: "Carlos Oliveira", empresas: 5 },
  { contador: "Fernanda Souza", empresas: 9 }, { contador: "Ricardo Mendes", empresas: 6 },
];

const ultimasCobrancas = [
  { contador: "João Silva", competencia: "Abr/2026", valor: "R$ 297,00", vencimento: "10/04/2026", status: "pago" },
  { contador: "Maria Santos", competencia: "Abr/2026", valor: "R$ 497,00", vencimento: "10/04/2026", status: "pago" },
  { contador: "Carlos Oliveira", competencia: "Abr/2026", valor: "R$ 97,00", vencimento: "10/04/2026", status: "pendente" },
  { contador: "Fernanda Souza", competencia: "Abr/2026", valor: "R$ 297,00", vencimento: "10/04/2026", status: "pendente" },
  { contador: "Pedro Lima", competencia: "Mar/2026", valor: "R$ 97,00", vencimento: "10/03/2026", status: "vencido" },
];

const ultimosPagamentos = [
  { data: "08/04/2026", contador: "João Silva", valor: "R$ 297,00", plano: "Pro" },
  { data: "09/04/2026", contador: "Maria Santos", valor: "R$ 497,00", plano: "Enterprise" },
  { data: "07/04/2026", contador: "Ana Costa", valor: "R$ 497,00", plano: "Enterprise" },
  { data: "05/04/2026", contador: "Restaurante Sabor", valor: "R$ 97,00", plano: "Starter" },
];

const alertas = [
  { tipo: "vencido", msg: "3 contadores com pagamento vencido" },
  { tipo: "certificado", msg: "2 empresas com certificado A1 vencendo nos próximos 30 dias" },
  { tipo: "pendente", msg: "7 cobranças pendentes totalizam R$ 1.679,00" },
];

const AdminDashboard = () => {
  const totalContadores = 38;
  const totalEmpresas = 127;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral da plataforma xFiscal</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <StatCard title="Contadores" value={totalContadores} icon={Users} color="primary" />
        <StatCard title="Empresas" value={totalEmpresas} icon={Building2} color="accent" />
        <StatCard title="Contadores Pagos" value={28} icon={CheckCircle} color="accent" />
        <StatCard title="Pendentes" value={7} icon={Clock} color="warning" />
        <StatCard title="Vencidos" value={3} icon={AlertTriangle} color="destructive" />
        <StatCard title="Receita Mês" value={27400} prefix="R$ " icon={DollarSign} color="primary" trend={{ value: 15, label: "mês" }} />
        <StatCard title="Receita Acum." value={241700} prefix="R$ " icon={TrendingUp} color="accent" />
        <StatCard title="Cobranças Ativas" value={38} icon={CreditCard} color="primary" />
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((a, i) => (
            <div key={i} className={`rounded-xl p-3 flex items-center gap-3 text-sm ${a.tipo === "vencido" ? "bg-destructive/10 border border-destructive/30" : a.tipo === "certificado" ? "bg-[hsl(45,93%,47%)]/10 border border-[hsl(45,93%,47%)]/30" : "bg-primary/10 border border-primary/30"}`}>
              <AlertTriangle size={16} className={a.tipo === "vencido" ? "text-destructive" : a.tipo === "certificado" ? "text-[hsl(45,93%,47%)]" : "text-primary"} />
              <span className="text-foreground">{a.msg}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Receita da Plataforma (R$)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={receitaMensal}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "Receita"]} />
              <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Contadores por Status</h3>
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

      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Empresas por Contador</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={empresasPorContador} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="contador" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={120} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
            <Bar dataKey="empresas" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
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
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Últimos Pagamentos</h3>
          </div>
          <DataTable
            columns={[
              { key: "data", header: "Data" },
              { key: "contador", header: "Contador" },
              { key: "valor", header: "Valor" },
              { key: "plano", header: "Plano", render: (r: any) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.plano}</span> },
            ]}
            data={ultimosPagamentos}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
