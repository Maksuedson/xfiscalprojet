import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { FileText, ArrowUpRight, ArrowDownLeft, Receipt, DollarSign, ShieldCheck, Users, Package, Clock, AlertTriangle, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Button } from "@/components/ui/button";

const notasPorMes = [
  { mes: "Jan", entrada: 18, saida: 35, nfce: 72 }, { mes: "Fev", entrada: 22, saida: 38, nfce: 78 },
  { mes: "Mar", entrada: 15, saida: 42, nfce: 65 }, { mes: "Abr", entrada: 20, saida: 45, nfce: 82 },
  { mes: "Mai", entrada: 25, saida: 40, nfce: 75 }, { mes: "Jun", entrada: 19, saida: 48, nfce: 88 },
];

const valorPorMes = [
  { mes: "Jan", valor: 42500 }, { mes: "Fev", valor: 48200 }, { mes: "Mar", valor: 38700 },
  { mes: "Abr", valor: 55300 }, { mes: "Mai", valor: 51800 }, { mes: "Jun", valor: 62400 },
];

const ultimasNotas = [
  { numero: "000142", tipo: "NF-e Saída", dest: "Cliente ABC LTDA", valor: "R$ 4.250,00", status: "Autorizada", data: "05/04/2026" },
  { numero: "000141", tipo: "NFC-e", dest: "Consumidor Final", valor: "R$ 89,90", status: "Autorizada", data: "05/04/2026" },
  { numero: "000140", tipo: "NF-e Entrada", dest: "Fornecedor XYZ", valor: "R$ 12.800,00", status: "Autorizada", data: "04/04/2026" },
  { numero: "000139", tipo: "NF-e Devolução", dest: "Cliente DEF ME", valor: "R$ 1.350,00", status: "Autorizada", data: "03/04/2026" },
  { numero: "000138", tipo: "NFC-e", dest: "Consumidor Final", valor: "R$ 156,50", status: "Rejeitada", data: "03/04/2026" },
];

const cobrancasPendentes = [
  { competencia: "Abr/2026", valor: "R$ 197,00", vencimento: "15/04/2026", status: "pendente" },
  { competencia: "Mar/2026", valor: "R$ 197,00", vencimento: "15/03/2026", status: "vencido" },
];

const EmissorDashboard = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Painel da Empresa</h1>
        <p className="text-muted-foreground">Tech Solutions LTDA — Resumo fiscal e operacional</p>
      </div>
      <div className="flex gap-2">
        <Link to="/dashboard/nfe/saida"><Button><Plus size={14} className="mr-1" /> Emitir NF-e</Button></Link>
        <Link to="/dashboard/nfce"><Button variant="outline"><Plus size={14} className="mr-1" /> Emitir NFC-e</Button></Link>
      </div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
      <StatCard title="Certificado" value="Válido" icon={ShieldCheck} color="accent" />
      <StatCard title="Notas Emitidas" value={489} icon={FileText} color="primary" />
      <StatCard title="NF-e Saída" value={248} icon={ArrowUpRight} color="accent" />
      <StatCard title="NF-e Entrada" value={139} icon={ArrowDownLeft} color="primary" />
      <StatCard title="NFC-e" value={380} icon={Receipt} color="primary" />
      <StatCard title="Clientes" value={28} icon={Users} color="accent" />
      <StatCard title="Produtos" value={85} icon={Package} color="primary" />
      <StatCard title="Faturamento" value={298900} prefix="R$ " icon={DollarSign} color="accent" trend={{ value: 8, label: "mês" }} />
    </div>

    {/* Alertas */}
    {cobrancasPendentes.length > 0 && (
      <div className="bg-[hsl(45,93%,47%)]/10 border border-[hsl(45,93%,47%)]/30 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="text-[hsl(45,93%,47%)]" size={20} />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Você tem {cobrancasPendentes.length} cobrança(s) pendente(s)</p>
          <p className="text-xs text-muted-foreground">Verifique seus pagamentos para evitar bloqueio</p>
        </div>
        <Link to="/dashboard/mensalidades"><Button size="sm" variant="outline">Ver cobranças</Button></Link>
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Faturamento Mensal (R$)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={valorPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "Valor"]} />
            <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Notas Emitidas por Mês</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={notasPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
            <Legend />
            <Line type="monotone" dataKey="saida" name="Saída" stroke="hsl(var(--primary))" strokeWidth={2} />
            <Line type="monotone" dataKey="nfce" name="NFC-e" stroke="hsl(152, 60%, 45%)" strokeWidth={2} />
            <Line type="monotone" dataKey="entrada" name="Entrada" stroke="hsl(45, 93%, 47%)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Últimas Notas Fiscais</h3>
          <Link to="/dashboard/nfe/saida" className="text-xs text-primary hover:underline">Ver todas →</Link>
        </div>
        <DataTable
          columns={[
            { key: "numero", header: "Nº" },
            { key: "tipo", header: "Tipo", render: (r: any) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.tipo}</span> },
            { key: "dest", header: "Destinatário" },
            { key: "valor", header: "Valor" },
            { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Autorizada" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{r.status}</span> },
            { key: "data", header: "Data" },
          ]}
          data={ultimasNotas}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Cobranças Pendentes</h3>
        </div>
        <DataTable
          columns={[
            { key: "competencia", header: "Comp." },
            { key: "valor", header: "Valor" },
            { key: "vencimento", header: "Venc." },
            { key: "status", header: "Status", render: (r: any) => {
              const c: Record<string, string> = { pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", vencido: "bg-destructive/10 text-destructive" };
              return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c[r.status]}`}>{r.status}</span>;
            }},
          ]}
          data={cobrancasPendentes}
        />
      </div>
    </div>
  </div>
);

export default EmissorDashboard;
