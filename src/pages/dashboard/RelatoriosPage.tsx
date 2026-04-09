import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Download, Filter, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const faturamentoData: Record<string, { mes: string; entrada: number; saida: number }[]> = {
  "2026": [
    { mes: "Jan", entrada: 45200, saida: 78500 },
    { mes: "Fev", entrada: 52100, saida: 82300 },
    { mes: "Mar", entrada: 48700, saida: 91200 },
    { mes: "Abr", entrada: 61300, saida: 95800 },
    { mes: "Mai", entrada: 55800, saida: 88400 },
    { mes: "Jun", entrada: 63200, saida: 102500 },
  ],
  "2025": [
    { mes: "Jan", entrada: 32100, saida: 58200 },
    { mes: "Fev", entrada: 38500, saida: 62400 },
    { mes: "Mar", entrada: 41200, saida: 71800 },
    { mes: "Abr", entrada: 45800, saida: 75200 },
    { mes: "Mai", entrada: 42300, saida: 69500 },
    { mes: "Jun", entrada: 48900, saida: 82100 },
    { mes: "Jul", entrada: 51200, saida: 85300 },
    { mes: "Ago", entrada: 53800, saida: 88700 },
    { mes: "Set", entrada: 49600, saida: 79400 },
    { mes: "Out", entrada: 55100, saida: 92300 },
    { mes: "Nov", entrada: 58200, saida: 96800 },
    { mes: "Dez", entrada: 62400, saida: 105200 },
  ],
};

const notasPorTipo = [
  { name: "NF-e Saída", value: 423, color: "hsl(217, 91%, 50%)" },
  { name: "NFC-e", value: 892, color: "hsl(152, 60%, 45%)" },
  { name: "NF-e Entrada", value: 156, color: "hsl(45, 93%, 47%)" },
  { name: "Devolução", value: 18, color: "hsl(0, 84%, 60%)" },
];

const dreData = [
  { item: "Receita Bruta de Vendas", valor: 538700, tipo: "receita" },
  { item: "(-) Devoluções e Abatimentos", valor: -12350, tipo: "deducao" },
  { item: "(-) Impostos sobre Vendas (ICMS, PIS, COFINS)", valor: -86192, tipo: "deducao" },
  { item: "= Receita Líquida", valor: 440158, tipo: "subtotal" },
  { item: "(-) Custo das Mercadorias Vendidas (CMV)", valor: -264094, tipo: "deducao" },
  { item: "= Lucro Bruto", valor: 176064, tipo: "subtotal" },
  { item: "(-) Despesas Operacionais", valor: -52819, tipo: "deducao" },
  { item: "(-) Despesas Administrativas", valor: -26413, tipo: "deducao" },
  { item: "= Lucro Operacional (EBITDA)", valor: 96832, tipo: "resultado" },
];

const RelatoriosPage = () => {
  const [periodo, setPeriodo] = useState("2026");
  const [filterOpen, setFilterOpen] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  const faturamento = faturamentoData[periodo] || faturamentoData["2026"];
  const totalEntrada = faturamento.reduce((s, f) => s + f.entrada, 0);
  const totalSaida = faturamento.reduce((s, f) => s + f.saida, 0);
  const totalNotas = notasPorTipo.reduce((s, n) => s + n.value, 0);
  const ticketMedio = totalSaida / (notasPorTipo.find((n) => n.name === "NF-e Saída")?.value || 1);

  const handleExport = () => {
    const csvContent = [
      "Mês,Entrada,Saída",
      ...faturamento.map((f) => `${f.mes},${f.entrada},${f.saida}`),
      `Total,${totalEntrada},${totalSaida}`,
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_faturamento_${periodo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Relatório ${periodo} exportado em CSV!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Relatórios</h1><p className="text-muted-foreground">Análise completa de faturamento e notas fiscais</p></div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setFilterOpen(true)}><Filter size={16} className="mr-2" />Filtrar</Button>
          <Button variant="hero" onClick={handleExport}><Download size={16} className="mr-2" />Exportar CSV</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Faturado", value: `R$ ${totalSaida.toLocaleString("pt-BR")}`, icon: TrendingUp, color: "text-accent" },
          { label: "Total Notas", value: totalNotas.toLocaleString("pt-BR"), icon: FileText, color: "text-primary" },
          { label: "Ticket Médio", value: `R$ ${ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-primary" },
          { label: "Total Compras", value: `R$ ${totalEntrada.toLocaleString("pt-BR")}`, icon: TrendingDown, color: "text-[hsl(45,93%,47%)]" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon size={16} className={kpi.color} />
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Faturamento Mensal — {periodo}</h3>
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="h-8 px-2 rounded-md border border-input bg-background text-xs">
              <option value="2026">2026</option><option value="2025">2025</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={faturamento}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, ""]} />
              <Legend />
              <Bar dataKey="entrada" name="Entrada" fill="hsl(45, 93%, 47%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saida" name="Saída" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Notas por Tipo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={notasPorTipo} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                {notasPorTipo.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {notasPorTipo.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: s.color }} /><span className="text-muted-foreground">{s.name}</span></div>
                <span className="font-medium text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DRE Simplificado */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">DRE Simplificado — {periodo}</h3>
        <div className="space-y-2">
          {dreData.map((item) => (
            <div key={item.item} className={`flex items-center justify-between py-2 px-3 rounded-lg ${item.tipo === "subtotal" ? "bg-muted/50 font-semibold" : item.tipo === "resultado" ? "bg-primary/10 font-bold" : ""}`}>
              <span className={`text-sm ${item.tipo === "resultado" ? "text-primary" : "text-foreground"}`}>{item.item}</span>
              <span className={`text-sm font-medium ${item.valor < 0 ? "text-destructive" : item.tipo === "resultado" ? "text-primary" : "text-foreground"}`}>
                {item.valor < 0 ? `(R$ ${Math.abs(item.valor).toLocaleString("pt-BR")})` : `R$ ${item.valor.toLocaleString("pt-BR")}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Filtrar */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Filtrar Relatório</DialogTitle>
            <DialogDescription>Selecione os critérios de filtragem.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="2026">2026</option><option value="2025">2025</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Nota</Label>
              <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="todos">Todos</option><option value="saida">NF-e Saída</option><option value="entrada">NF-e Entrada</option><option value="nfce">NFC-e</option><option value="devolucao">Devolução</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setFilterOpen(false)}>Cancelar</Button>
            <Button variant="hero" onClick={() => { toast.success("Filtros aplicados!"); setFilterOpen(false); }}>Aplicar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelatoriosPage;
