import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Building2, CheckCircle, Clock, AlertTriangle, ShieldCheck, FileText, DollarSign, CreditCard, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const cobrancasMes = [
  { mes: "Jan/26", geradas: 12, pagas: 10 }, { mes: "Fev/26", geradas: 14, pagas: 12 },
  { mes: "Mar/26", geradas: 15, pagas: 13 }, { mes: "Abr/26", geradas: 16, pagas: 14 },
  { mes: "Mai/26", geradas: 18, pagas: 15 }, { mes: "Jun/26", geradas: 20, pagas: 18 },
];

const statusCobrancas = [
  { name: "Pagas", value: 82, color: "hsl(152, 60%, 45%)" },
  { name: "Pendentes", value: 15, color: "hsl(45, 93%, 47%)" },
  { name: "Vencidas", value: 5, color: "hsl(0, 84%, 60%)" },
];

const ultimasEmpresas = [
  { empresa: "Tech Solutions LTDA", status: "ativa", certificado: "válido", notas: 142, ultimaEmissao: "05/04/2026" },
  { empresa: "Comércio Digital ME", status: "ativa", certificado: "vencendo", notas: 89, ultimaEmissao: "04/04/2026" },
  { empresa: "Import Export SA", status: "bloqueada", certificado: "vencido", notas: 45, ultimaEmissao: "15/03/2026" },
  { empresa: "Loja Virtual Pro", status: "ativa", certificado: "válido", notas: 56, ultimaEmissao: "03/04/2026" },
  { empresa: "Restaurante Sabor", status: "ativa", certificado: "válido", notas: 34, ultimaEmissao: "02/04/2026" },
];

const alertasFiscais = [
  { tipo: "certificado", msg: "Comércio Digital ME — certificado vence em 70 dias", data: "11/04/2026" },
  { tipo: "bloqueio", msg: "Import Export SA — bloqueada por certificado vencido", data: "01/03/2026" },
  { tipo: "emissao", msg: "NF-e 000138 rejeitada — Tech Solutions LTDA", data: "03/04/2026" },
];

const ContadorDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Painel do Contador</h1>
      <p className="text-muted-foreground">Visão geral da sua carteira de empresas</p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-4">
      <StatCard title="Total Empresas" value={12} icon={Building2} color="primary" />
      <StatCard title="Ativas" value={10} icon={CheckCircle} color="accent" />
      <StatCard title="Bloqueadas" value={1} icon={XCircle} color="destructive" />
      <StatCard title="Cert. Vencendo" value={1} icon={AlertTriangle} color="warning" />
      <StatCard title="Cobranças Geradas" value={102} icon={FileText} color="primary" />
      <StatCard title="Pendentes" value={15} icon={Clock} color="warning" />
      <StatCard title="Pagas" value={82} icon={CheckCircle} color="accent" />
      <StatCard title="Vencidas" value={5} icon={CreditCard} color="destructive" />
      <StatCard title="Receita Mês" value={4850} prefix="R$ " icon={DollarSign} color="primary" trend={{ value: 12, label: "mês" }} />
      <StatCard title="Certificados" value={12} icon={ShieldCheck} color="accent" />
    </div>

    {alertasFiscais.length > 0 && (
      <div className="space-y-2">
        {alertasFiscais.map((a, i) => (
          <div key={i} className={`rounded-xl p-3 flex items-center gap-3 text-sm ${a.tipo === "bloqueio" ? "bg-destructive/10 border border-destructive/30" : a.tipo === "certificado" ? "bg-[hsl(45,93%,47%)]/10 border border-[hsl(45,93%,47%)]/30" : "bg-primary/10 border border-primary/30"}`}>
            <AlertTriangle size={16} className={a.tipo === "bloqueio" ? "text-destructive" : a.tipo === "certificado" ? "text-[hsl(45,93%,47%)]" : "text-primary"} />
            <span className="flex-1 text-foreground">{a.msg}</span>
            <span className="text-xs text-muted-foreground">{a.data}</span>
          </div>
        ))}
      </div>
    )}

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
              {statusCobrancas.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {statusCobrancas.map(s => (
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
        <h3 className="text-sm font-semibold text-foreground">Empresas da Carteira</h3>
        <Link to="/dashboard/empresas" className="text-xs text-primary hover:underline">Ver todas →</Link>
      </div>
      <DataTable
        columns={[
          { key: "empresa", header: "Empresa" },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "ativa" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
          { key: "certificado", header: "Certificado", render: (r: any) => {
            const c: Record<string, string> = { "válido": "bg-accent/10 text-accent", "vencendo": "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", "vencido": "bg-destructive/10 text-destructive" };
            return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c[r.certificado]}`}>{r.certificado}</span>;
          }},
          { key: "notas", header: "Notas" },
          { key: "ultimaEmissao", header: "Última Emissão" },
        ]}
        data={ultimasEmpresas}
      />
    </div>
  </div>
);

export default ContadorDashboard;
