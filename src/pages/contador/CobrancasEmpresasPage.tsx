import { useState } from "react";
import { DollarSign, CheckCircle, Clock, AlertTriangle, Plus, Eye, Filter, QrCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const initialCobrancas = [
  { id: "1", empresa: "Tech Solutions LTDA", competencia: "Abr/2026", valor: 197, vencimento: "15/04/2026", status: "pago", pagamento: "14/04/2026" },
  { id: "2", empresa: "Comércio Digital ME", competencia: "Abr/2026", valor: 147, vencimento: "15/04/2026", status: "pago", pagamento: "15/04/2026" },
  { id: "3", empresa: "Import Export SA", competencia: "Abr/2026", valor: 297, vencimento: "15/04/2026", status: "pendente", pagamento: "-" },
  { id: "4", empresa: "Loja Virtual Pro", competencia: "Abr/2026", valor: 197, vencimento: "15/04/2026", status: "pendente", pagamento: "-" },
  { id: "5", empresa: "Restaurante Sabor", competencia: "Mar/2026", valor: 97, vencimento: "15/03/2026", status: "vencido", pagamento: "-" },
  { id: "6", empresa: "Padaria Central", competencia: "Abr/2026", valor: 97, vencimento: "15/04/2026", status: "pago", pagamento: "13/04/2026" },
];

const CobrancasEmpresasPage = () => {
  const [cobrancas, setCobrancas] = useState(initialCobrancas);
  const [filtro, setFiltro] = useState("todos");
  const [showNova, setShowNova] = useState(false);
  const [showDetalhe, setShowDetalhe] = useState<any>(null);
  const [showPix, setShowPix] = useState<any>(null);
  const [form, setForm] = useState({ empresa: "", competencia: "", valor: "", vencimento: "" });

  const filtered = filtro === "todos" ? cobrancas : cobrancas.filter(c => c.status === filtro);
  const totalPago = cobrancas.filter(c => c.status === "pago").reduce((s, c) => s + c.valor, 0);
  const totalPendente = cobrancas.filter(c => c.status === "pendente").reduce((s, c) => s + c.valor, 0);

  const handleCriar = () => {
    const nova = { id: String(cobrancas.length + 1), empresa: form.empresa, competencia: form.competencia, valor: parseFloat(form.valor) || 0, vencimento: form.vencimento, status: "pendente", pagamento: "-" };
    setCobrancas([nova, ...cobrancas]);
    toast({ title: "Cobrança gerada" });
    setShowNova(false);
  };

  const handlePago = (id: string) => {
    setCobrancas(cobrancas.map(c => c.id === id ? { ...c, status: "pago", pagamento: new Date().toLocaleDateString("pt-BR") } : c));
    toast({ title: "Pagamento confirmado" });
    setShowDetalhe(null);
  };

  const pixCode = "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540" + (showPix?.valor || "0") + "5802BR5925JOAO SILVA CONTABILIDADE6009SAO PAULO62070503***6304";

  const statusColors: Record<string, string> = { pago: "bg-accent/10 text-accent", pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", vencido: "bg-destructive/10 text-destructive" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cobranças das Empresas</h1>
          <p className="text-muted-foreground">Gestão de cobranças Contador → Empresas</p>
        </div>
        <Button onClick={() => setShowNova(true)}><Plus size={16} className="mr-2" /> Nova Cobrança</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Recebido" value={totalPago} prefix="R$ " icon={CheckCircle} color="accent" />
        <StatCard title="Pendente" value={totalPendente} prefix="R$ " icon={Clock} color="warning" />
        <StatCard title="Cobranças Pagas" value={cobrancas.filter(c => c.status === "pago").length} icon={CheckCircle} color="accent" />
        <StatCard title="Total Cobranças" value={cobrancas.length} icon={DollarSign} color="primary" />
      </div>

      <div className="flex items-center gap-3">
        <Filter size={16} className="text-muted-foreground" />
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pago">Pagos</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="vencido">Vencidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={[
          { key: "empresa", header: "Empresa" },
          { key: "competencia", header: "Competência" },
          { key: "valor", header: "Valor", render: (r: any) => `R$ ${r.valor.toFixed(2).replace(".", ",")}` },
          { key: "vencimento", header: "Vencimento" },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span> },
          { key: "pagamento", header: "Pago em" },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowDetalhe(r)}><Eye size={14} /></Button>
              {r.status !== "pago" && <Button variant="ghost" size="sm" onClick={() => setShowPix(r)}><QrCode size={14} /></Button>}
            </div>
          )},
        ]}
        data={filtered}
      />

      {/* Modal nova cobrança */}
      <Dialog open={showNova} onOpenChange={setShowNova}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Cobrança</DialogTitle><DialogDescription>Gerar cobrança para empresa</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Empresa</Label><Input value={form.empresa} onChange={e => setForm({...form, empresa: e.target.value})} placeholder="Nome da empresa" /></div>
            <div><Label>Competência</Label><Input value={form.competencia} onChange={e => setForm({...form, competencia: e.target.value})} placeholder="Mai/2026" /></div>
            <div><Label>Valor (R$)</Label><Input value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="197,00" /></div>
            <div><Label>Vencimento</Label><Input type="date" value={form.vencimento} onChange={e => setForm({...form, vencimento: e.target.value})} /></div>
          </div>
          <DialogFooter><Button onClick={handleCriar}>Gerar Cobrança</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal detalhe */}
      <Dialog open={!!showDetalhe} onOpenChange={() => setShowDetalhe(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhe da Cobrança</DialogTitle><DialogDescription>Informações da cobrança</DialogDescription></DialogHeader>
          {showDetalhe && (
            <div className="space-y-3 text-sm grid grid-cols-2 gap-3">
              <div><span className="text-muted-foreground">Empresa:</span><p className="font-medium">{showDetalhe.empresa}</p></div>
              <div><span className="text-muted-foreground">Valor:</span><p className="font-medium">R$ {showDetalhe.valor.toFixed(2).replace(".", ",")}</p></div>
              <div><span className="text-muted-foreground">Competência:</span><p className="font-medium">{showDetalhe.competencia}</p></div>
              <div><span className="text-muted-foreground">Vencimento:</span><p className="font-medium">{showDetalhe.vencimento}</p></div>
              <div><span className="text-muted-foreground">Status:</span><p className="font-medium"><span className={`px-2 py-1 rounded-full text-xs ${statusColors[showDetalhe.status]}`}>{showDetalhe.status}</span></p></div>
              <div><span className="text-muted-foreground">Pago em:</span><p className="font-medium">{showDetalhe.pagamento}</p></div>
            </div>
          )}
          <DialogFooter>
            {showDetalhe?.status !== "pago" && <Button onClick={() => handlePago(showDetalhe.id)}>Confirmar Pagamento</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal PIX */}
      <Dialog open={!!showPix} onOpenChange={() => setShowPix(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cobrança PIX</DialogTitle><DialogDescription>{showPix?.empresa} — R$ {showPix?.valor?.toFixed(2).replace(".", ",")}</DialogDescription></DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
              <QrCode size={120} className="text-foreground" />
            </div>
            <div className="w-full">
              <Label className="text-xs text-muted-foreground">Código Copia e Cola</Label>
              <div className="flex gap-2 mt-1">
                <Input value={pixCode} readOnly className="text-xs font-mono" />
                <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(pixCode); toast({ title: "Código copiado!" }); }}>
                  <Copy size={14} />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={() => { handlePago(showPix.id); setShowPix(null); }}>Confirmar Recebimento</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CobrancasEmpresasPage;
