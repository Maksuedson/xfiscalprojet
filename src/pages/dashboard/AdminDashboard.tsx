import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Users, CheckCircle, Clock, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const receitaMensal = [
  { mes: "Jan", receita: 12400, contadores: 18 },
  { mes: "Fev", receita: 13200, contadores: 19 },
  { mes: "Mar", receita: 14800, contadores: 21 },
  { mes: "Abr", receita: 15600, contadores: 23 },
  { mes: "Mai", receita: 16200, contadores: 24 },
  { mes: "Jun", receita: 18900, contadores: 26 },
  { mes: "Jul", receita: 19500, contadores: 27 },
  { mes: "Ago", receita: 21200, contadores: 29 },
  { mes: "Set", receita: 22800, contadores: 31 },
  { mes: "Out", receita: 24100, contadores: 33 },
  { mes: "Nov", receita: 25600, contadores: 35 },
  { mes: "Dez", receita: 27400, contadores: 38 },
];

const statusMensalidades = [
  { name: "Pagas", value: 142, color: "hsl(152, 60%, 45%)" },
  { name: "Pendentes", value: 23, color: "hsl(45, 93%, 47%)" },
  { name: "Atrasadas", value: 8, color: "hsl(0, 84%, 60%)" },
];

const ultimosContadores = [
  { nome: "João Silva Contabilidade", empresas: 12, status: "Ativo", plano: "Profissional", criado: "15/03/2026" },
  { nome: "Maria Santos Assessoria", empresas: 8, status: "Ativo", plano: "Enterprise", criado: "22/02/2026" },
  { nome: "Carlos Oliveira Cont.", empresas: 5, status: "Ativo", plano: "Starter", criado: "10/01/2026" },
  { nome: "Ana Costa Contábil", empresas: 15, status: "Ativo", plano: "Enterprise", criado: "05/12/2025" },
  { nome: "Pedro Lima Assessoria", empresas: 3, status: "Pendente", plano: "Starter", criado: "01/04/2026" },
];

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Dashboard Administrativo</h1>
      <p className="text-muted-foreground">Visão geral da plataforma xFiscal</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Contadores ativos" value={38} icon={Users} color="primary" trend={{ value: 12, label: "mês" }} />
      <StatCard title="Pagos no mês" value={142} icon={CheckCircle} color="accent" trend={{ value: 8, label: "mês" }} />
      <StatCard title="Pendentes" value={23} icon={Clock} color="warning" />
      <StatCard title="Receita do mês" value={27400} prefix="R$ " icon={DollarSign} color="primary" trend={{ value: 15, label: "mês" }} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Receita mensal */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Receita Mensal (R$)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={receitaMensal}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status mensalidades */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Status das Mensalidades</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={statusMensalidades} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
              {statusMensalidades.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {statusMensalidades.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
              </div>
              <span className="font-medium text-foreground">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Evolução de contadores */}
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <h3 className="text-sm font-semibold text-foreground mb-4">Evolução de Contadores</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={receitaMensal}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
          <Line type="monotone" dataKey="contadores" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Últimos contadores */}
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Últimos Contadores Cadastrados</h3>
      <DataTable
        columns={[
          { key: "nome", header: "Nome" },
          { key: "empresas", header: "Empresas" },
          { key: "plano", header: "Plano", render: (r) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.plano}</span> },
          { key: "status", header: "Status", render: (r) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Ativo" ? "bg-accent/10 text-accent" : "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]"}`}>{r.status}</span> },
          { key: "criado", header: "Cadastro" },
        ]}
        data={ultimosContadores}
      />
    </div>
  </div>
);

export default AdminDashboard;
