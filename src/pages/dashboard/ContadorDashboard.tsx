import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Building2, FileText, Clock, CreditCard, DollarSign, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const cobrancasMes = [
  { mes: "Jan/26", geradas: 12, pagas: 10 },
  { mes: "Fev/26", geradas: 14, pagas: 12 },
  { mes: "Mar/26", geradas: 15, pagas: 13 },
  { mes: "Abr/26", geradas: 16, pagas: 14 },
  { mes: "Mai/26", geradas: 18, pagas: 15 },
  { mes: "Jun/26", geradas: 20, pagas: 18 },
];

const statusCobrancas = [
  { name: "Pagas", value: 82, color: "hsl(152, 60%, 45%)" },
  { name: "Pendentes", value: 15, color: "hsl(45, 93%, 47%)" },
  { name: "Vencidas", value: 5, color: "hsl(0, 84%, 60%)" },
];

const ultimosPagamentos = [
  { data: "05/04/2026", empresa: "Tech Solutions LTDA", valor: "R$ 297,00", obs: "Mensalidade Abr/2026" },
  { data: "03/04/2026", empresa: "Comércio Digital ME", valor: "R$ 197,00", obs: "Mensalidade Abr/2026" },
  { data: "01/04/2026", empresa: "Import Export SA", valor: "R$ 497,00", obs: "Mensalidade Abr/2026" },
  { data: "28/03/2026", empresa: "Restaurante Sabor", valor: "R$ 147,00", obs: "Mensalidade Mar/2026" },
];

const ultimasCobrancas = [
  { data: "01/04/2026", empresa: "Tech Solutions LTDA", competencia: "Abr/2026", status: "approved", valor: "R$ 297,00" },
  { data: "01/04/2026", empresa: "Comércio Digital ME", competencia: "Abr/2026", status: "pending", valor: "R$ 197,00" },
  { data: "01/04/2026", empresa: "Loja Virtual Pro", competencia: "Abr/2026", status: "pending", valor: "R$ 297,00" },
  { data: "01/03/2026", empresa: "Padaria Central", competencia: "Mar/2026", status: "approved", valor: "R$ 97,00" },
];

const ContadorDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Painel do Contador</h1>
      <p className="text-muted-foreground">Painel financeiro do módulo contador ↔ empresas</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard title="Total de empresas" value={12} icon={Building2} color="primary" />
      <StatCard title="Cobranças geradas" value={102} icon={FileText} color="primary" />
      <StatCard title="Pendentes" value={15} icon={Clock} color="warning" />
      <StatCard title="Pagas" value={82} icon={CheckCircle} color="accent" />
      <StatCard title="Vencidas" value={5} icon={CreditCard} color="destructive" />
      <StatCard title="Receita do mês" value={4850} prefix="R$ " icon={DollarSign} color="primary" trend={{ value: 12, label: "mês" }} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Cobranças por Mês</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cobrancasMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
            <Legend />
            <Bar dataKey="geradas" name="Geradas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pagas" name="Pagas" fill="hsl(152, 60%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Status das Cobranças</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={statusCobrancas} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
              {statusCobrancas.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {statusCobrancas.map((s) => (
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

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Últimos Pagamentos</h3>
        <DataTable
          columns={[
            { key: "data", header: "Data" },
            { key: "empresa", header: "Empresa" },
            { key: "valor", header: "Valor" },
            { key: "obs", header: "Observação" },
          ]}
          data={ultimosPagamentos}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Últimas Cobranças</h3>
        <DataTable
          columns={[
            { key: "data", header: "Data" },
            { key: "empresa", header: "Empresa" },
            { key: "competencia", header: "Competência" },
            {
              key: "status", header: "Status",
              render: (r) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "approved" ? "bg-accent/10 text-accent" : "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]"}`}>
                  {r.status === "approved" ? "Paga" : "Pendente"}
                </span>
              ),
            },
            { key: "valor", header: "Valor" },
          ]}
          data={ultimasCobrancas}
        />
      </div>
    </div>
  </div>
);

export default ContadorDashboard;
