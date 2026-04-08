import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { FileText, ArrowUpRight, ArrowDownLeft, RotateCcw, Receipt, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const notasPorMes = meses.map((mes, i) => ({
  mes,
  entrada: Math.floor(Math.random() * 30 + 10),
  saida: Math.floor(Math.random() * 50 + 20),
  devolucao: Math.floor(Math.random() * 5),
  nfce: Math.floor(Math.random() * 80 + 30),
}));

const valorPorMes = meses.map((mes, i) => ({
  mes,
  valor: Math.floor(Math.random() * 80000 + 20000),
}));

const tabelaResumo = notasPorMes.map((n, i) => ({
  mes: n.mes,
  qtd: n.entrada + n.saida + n.devolucao + n.nfce,
  valor: `R$ ${(valorPorMes[i].valor).toLocaleString("pt-BR")}`,
}));

const ultimasNotas = [
  { numero: "000142", tipo: "NF-e Saída", destinatario: "Cliente ABC LTDA", valor: "R$ 4.250,00", status: "Autorizada", data: "05/04/2026" },
  { numero: "000141", tipo: "NFC-e", destinatario: "Consumidor Final", valor: "R$ 89,90", status: "Autorizada", data: "05/04/2026" },
  { numero: "000140", tipo: "NF-e Entrada", destinatario: "Fornecedor XYZ", valor: "R$ 12.800,00", status: "Autorizada", data: "04/04/2026" },
  { numero: "000139", tipo: "NF-e Devolução", destinatario: "Cliente DEF ME", valor: "R$ 1.350,00", status: "Autorizada", data: "03/04/2026" },
  { numero: "000138", tipo: "NFC-e", destinatario: "Consumidor Final", valor: "R$ 156,50", status: "Rejeitada", data: "03/04/2026" },
];

const EmissorDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Painel do Emissor</h1>
      <p className="text-muted-foreground">Resumo fiscal da sua empresa</p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard title="NF-e Entrada" value={156} icon={ArrowDownLeft} color="primary" />
      <StatCard title="NF-e Saída" value={423} icon={ArrowUpRight} color="accent" />
      <StatCard title="NF-e Devolução" value={18} icon={RotateCcw} color="warning" />
      <StatCard title="NFC-e" value={892} icon={Receipt} color="primary" />
      <StatCard title="Total de Notas" value={1489} icon={FileText} color="primary" />
      <StatCard title="Faturamento" value={284500} prefix="R$ " icon={DollarSign} color="accent" trend={{ value: 8, label: "mês" }} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Valor Total Notas Emitidas — {new Date().getFullYear()}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={valorPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "Valor"]} />
            <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Qtd. Notas Emitidas — {new Date().getFullYear()}</h3>
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
            <Line type="monotone" dataKey="devolucao" name="Devolução" stroke="hsl(0, 84%, 60%)" strokeWidth={1} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Resumo mensal */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Resumo Mensal — {new Date().getFullYear()}</h3>
        <DataTable
          columns={[
            { key: "mes", header: "Mês" },
            { key: "qtd", header: "Nº de Notas" },
            { key: "valor", header: "Valor Total" },
          ]}
          data={tabelaResumo}
        />
      </div>

      <div className="lg:col-span-2">
        <h3 className="text-sm font-semibold text-foreground mb-3">Últimas Notas Fiscais</h3>
        <DataTable
          columns={[
            { key: "numero", header: "Número" },
            { key: "tipo", header: "Tipo", render: (r) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.tipo}</span> },
            { key: "destinatario", header: "Destinatário" },
            { key: "valor", header: "Valor" },
            {
              key: "status", header: "Status",
              render: (r) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "Autorizada" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                  {r.status}
                </span>
              ),
            },
            { key: "data", header: "Data" },
          ]}
          data={ultimasNotas}
        />
      </div>
    </div>
  </div>
);

export default EmissorDashboard;
