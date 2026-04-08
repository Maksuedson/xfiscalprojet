import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Download, Filter } from "lucide-react";

const faturamentoMensal = [
  { mes: "Jan", entrada: 45200, saida: 78500 },
  { mes: "Fev", entrada: 52100, saida: 82300 },
  { mes: "Mar", entrada: 48700, saida: 91200 },
  { mes: "Abr", entrada: 61300, saida: 95800 },
  { mes: "Mai", entrada: 55800, saida: 88400 },
  { mes: "Jun", entrada: 63200, saida: 102500 },
];

const notasPorTipo = [
  { name: "NF-e Saída", value: 423, color: "hsl(217, 91%, 50%)" },
  { name: "NFC-e", value: 892, color: "hsl(152, 60%, 45%)" },
  { name: "NF-e Entrada", value: 156, color: "hsl(45, 93%, 47%)" },
  { name: "Devolução", value: 18, color: "hsl(0, 84%, 60%)" },
];

const RelatoriosPage = () => {
  const [periodo, setPeriodo] = useState("2026");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-foreground">Relatórios</h1><p className="text-muted-foreground">Análise completa de faturamento e notas fiscais</p></div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter size={16} className="mr-2" />Filtrar</Button>
          <Button variant="hero"><Download size={16} className="mr-2" />Exportar PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Faturamento Mensal — {periodo}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={faturamentoMensal}>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Faturado", value: "R$ 538.700" },
          { label: "Total Notas", value: "1.489" },
          { label: "Ticket Médio", value: "R$ 361,78" },
          { label: "Notas Rejeitadas", value: "12" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-4 shadow-card text-center">
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatoriosPage;
