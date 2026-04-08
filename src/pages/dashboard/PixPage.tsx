import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, Clock, DollarSign, Plus, QrCode } from "lucide-react";

const cobrancas = [
  { id: 1, empresa: "Tech Solutions LTDA", competencia: "Abr/2026", valor: "R$ 297,00", vencimento: "10/04/2026", status: "pending", criado: "01/04/2026" },
  { id: 2, empresa: "Comércio Digital ME", competencia: "Abr/2026", valor: "R$ 197,00", vencimento: "10/04/2026", status: "approved", criado: "01/04/2026" },
  { id: 3, empresa: "Import Export SA", competencia: "Abr/2026", valor: "R$ 497,00", vencimento: "10/04/2026", status: "approved", criado: "01/04/2026" },
  { id: 4, empresa: "Restaurante Sabor", competencia: "Mar/2026", valor: "R$ 147,00", vencimento: "10/03/2026", status: "approved", criado: "01/03/2026" },
  { id: 5, empresa: "Loja Virtual Pro", competencia: "Mar/2026", valor: "R$ 297,00", vencimento: "10/03/2026", status: "pending", criado: "01/03/2026" },
];

const statusMap: Record<string, { label: string; className: string }> = {
  approved: { label: "Pago", className: "bg-accent/10 text-accent" },
  pending: { label: "Pendente", className: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]" },
  overdue: { label: "Vencido", className: "bg-destructive/10 text-destructive" },
};

const PixPage = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div><h1 className="text-2xl font-bold text-foreground">Cobrança PIX</h1><p className="text-muted-foreground">Gerencie cobranças PIX das empresas</p></div>
      <Button variant="hero"><Plus size={16} className="mr-2" />Nova Cobrança</Button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total de cobranças" value={102} icon={CreditCard} color="primary" />
      <StatCard title="Pagas" value={82} icon={CheckCircle} color="accent" />
      <StatCard title="Pendentes" value={15} icon={Clock} color="warning" />
      <StatCard title="Receita total" value={24850} prefix="R$ " icon={DollarSign} color="primary" />
    </div>

    <DataTable
      columns={[
        { key: "empresa", header: "Empresa" },
        { key: "competencia", header: "Competência" },
        { key: "valor", header: "Valor" },
        { key: "vencimento", header: "Vencimento" },
        { key: "status", header: "Status", render: (r) => { const s = statusMap[r.status] || statusMap.pending; return <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>; } },
        { key: "acoes", header: "Ações", render: (r) => r.status === "pending" ? <Button variant="outline" size="sm"><QrCode size={14} className="mr-1" />Ver QR</Button> : <span className="text-xs text-muted-foreground">—</span> },
      ]}
      data={cobrancas}
    />
  </div>
);

export default PixPage;
