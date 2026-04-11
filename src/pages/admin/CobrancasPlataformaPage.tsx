import { useState } from "react";
import { DollarSign, CheckCircle, Clock, AlertTriangle, Plus, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const initialCobrancas = [
  { id: "1", contador: "João Silva Contabilidade", plano: "Pro", competencia: "Abr/2026", valor: 297, vencimento: "10/04/2026", status: "pago", pagamento: "08/04/2026" },
  { id: "2", contador: "Maria Santos Assessoria", plano: "Enterprise", competencia: "Abr/2026", valor: 497, vencimento: "10/04/2026", status: "pago", pagamento: "09/04/2026" },
  { id: "3", contador: "Carlos Oliveira Cont.", plano: "Starter", competencia: "Abr/2026", valor: 97, vencimento: "10/04/2026", status: "pendente", pagamento: "-" },
  { id: "4", contador: "Ana Costa Contábil", plano: "Enterprise", competencia: "Abr/2026", valor: 497, vencimento: "10/04/2026", status: "pago", pagamento: "07/04/2026" },
  { id: "5", contador: "Pedro Lima Assessoria", plano: "Starter", competencia: "Mar/2026", valor: 97, vencimento: "10/03/2026", status: "vencido", pagamento: "-" },
  { id: "6", contador: "Fernanda Souza", plano: "Pro", competencia: "Abr/2026", valor: 297, vencimento: "10/04/2026", status: "pendente", pagamento: "-" },
  { id: "7", contador: "Ricardo Mendes", plano: "Pro", competencia: "Abr/2026", valor: 297, vencimento: "10/04/2026", status: "cancelado", pagamento: "-" },
];

const CobrancasPlataformaPage = () => {
  const [cobrancas, setCobrancas] = useState(initialCobrancas);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [showNova, setShowNova] = useState(false);
  const [showDetalhe, setShowDetalhe] = useState<any>(null);
  const [form, setForm] = useState({ contador: "", plano: "Pro", competencia: "", valor: "", vencimento: "" });

  const filtered = filtroStatus === "todos" ? cobrancas : cobrancas.filter(c => c.status === filtroStatus);
  const totalPago = cobrancas.filter(c => c.status === "pago").reduce((s, c) => s + c.valor, 0);
  const totalPendente = cobrancas.filter(c => c.status === "pendente").reduce((s, c) => s + c.valor, 0);
  const totalVencido = cobrancas.filter(c => c.status === "vencido").reduce((s, c) => s + c.valor, 0);

  const handleCriar = () => {
    const nova = { id: String(cobrancas.length + 1), contador: form.contador, plano: form.plano, competencia: form.competencia, valor: parseFloat(form.valor) || 0, vencimento: form.vencimento, status: "pendente", pagamento: "-" };
    setCobrancas([nova, ...cobrancas]);
    toast({ title: "Cobrança gerada", description: `Cobrança para ${form.contador}` });
    setShowNova(false);
    setForm({ contador: "", plano: "Pro", competencia: "", valor: "", vencimento: "" });
  };

  const handleMarcarPago = (id: string) => {
    setCobrancas(cobrancas.map(c => c.id === id ? { ...c, status: "pago", pagamento: new Date().toLocaleDateString("pt-BR") } : c));
    toast({ title: "Cobrança marcada como paga" });
    setShowDetalhe(null);
  };

  const statusColors: Record<string, string> = {
    pago: "bg-accent/10 text-accent", pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
    vencido: "bg-destructive/10 text-destructive", cancelado: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cobranças da Plataforma</h1>
          <p className="text-muted-foreground">Gestão de mensalidades Admin → Contadores</p>
        </div>
        <Button onClick={() => setShowNova(true)}><Plus size={16} className="mr-2" /> Nova Cobrança</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Recebido" value={totalPago} prefix="R$ " icon={CheckCircle} color="accent" />
        <StatCard title="Pendente" value={totalPendente} prefix="R$ " icon={Clock} color="warning" />
        <StatCard title="Vencido" value={totalVencido} prefix="R$ " icon={AlertTriangle} color="destructive" />
        <StatCard title="Total Cobranças" value={cobrancas.length} icon={DollarSign} color="primary" />
      </div>

      <div className="flex items-center gap-3">
        <Filter size={16} className="text-muted-foreground" />
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pago">Pagos</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="vencido">Vencidos</SelectItem>
            <SelectItem value="cancelado">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={[
          { key: "contador", header: "Contador" },
          { key: "plano", header: "Plano", render: (r: any) => <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{r.plano}</span> },
          { key: "competencia", header: "Competência" },
          { key: "valor", header: "Valor", render: (r: any) => `R$ ${r.valor.toFixed(2).replace(".", ",")}` },
          { key: "vencimento", header: "Vencimento" },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span> },
          { key: "pagamento", header: "Pago em" },
          { key: "acoes", header: "Ações", render: (r: any) => <Button variant="ghost" size="sm" onClick={() => setShowDetalhe(r)}><Eye size={14} /></Button> },
        ]}
        data={filtered}
      />

      {/* Modal nova cobrança */}
      <Dialog open={showNova} onOpenChange={setShowNova}>
        <DialogContent>
          <DialogHeader><DialogTitle>Gerar Nova Cobrança</DialogTitle><DialogDescription>Cobrança de mensalidade para contador</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Contador</Label><Input value={form.contador} onChange={e => setForm({...form, contador: e.target.value})} placeholder="Nome do contador" /></div>
            <div><Label>Plano</Label>
              <Select value={form.plano} onValueChange={v => setForm({...form, plano: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter - R$ 97,00</SelectItem>
                  <SelectItem value="Pro">Pro - R$ 297,00</SelectItem>
                  <SelectItem value="Enterprise">Enterprise - R$ 497,00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Competência</Label><Input value={form.competencia} onChange={e => setForm({...form, competencia: e.target.value})} placeholder="Mai/2026" /></div>
            <div><Label>Valor (R$)</Label><Input value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="297,00" /></div>
            <div><Label>Vencimento</Label><Input type="date" value={form.vencimento} onChange={e => setForm({...form, vencimento: e.target.value})} /></div>
          </div>
          <DialogFooter><Button onClick={handleCriar}>Gerar Cobrança</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal detalhe */}
      <Dialog open={!!showDetalhe} onOpenChange={() => setShowDetalhe(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhe da Cobrança</DialogTitle><DialogDescription>Informações da cobrança selecionada</DialogDescription></DialogHeader>
          {showDetalhe && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Contador:</span><p className="font-medium">{showDetalhe.contador}</p></div>
                <div><span className="text-muted-foreground">Plano:</span><p className="font-medium">{showDetalhe.plano}</p></div>
                <div><span className="text-muted-foreground">Competência:</span><p className="font-medium">{showDetalhe.competencia}</p></div>
                <div><span className="text-muted-foreground">Valor:</span><p className="font-medium">R$ {showDetalhe.valor.toFixed(2).replace(".", ",")}</p></div>
                <div><span className="text-muted-foreground">Vencimento:</span><p className="font-medium">{showDetalhe.vencimento}</p></div>
                <div><span className="text-muted-foreground">Status:</span><p className="font-medium"><span className={`px-2 py-1 rounded-full text-xs ${statusColors[showDetalhe.status]}`}>{showDetalhe.status}</span></p></div>
                <div><span className="text-muted-foreground">Pagamento:</span><p className="font-medium">{showDetalhe.pagamento}</p></div>
              </div>
            </div>
          )}
          <DialogFooter>
            {showDetalhe?.status === "pendente" || showDetalhe?.status === "vencido" ? (
              <Button onClick={() => handleMarcarPago(showDetalhe.id)}>Marcar como Pago</Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CobrancasPlataformaPage;
