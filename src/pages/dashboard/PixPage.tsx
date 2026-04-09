import { useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, CheckCircle, Clock, DollarSign, Plus, QrCode, AlertCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const initialCobrancas = [
  { id: 1, empresa: "Tech Solutions LTDA", competencia: "Abr/2026", valor: "R$ 297,00", valorNum: 297, vencimento: "10/04/2026", status: "pending", criado: "01/04/2026", txid: "pix_tech_abr2026" },
  { id: 2, empresa: "Comércio Digital ME", competencia: "Abr/2026", valor: "R$ 197,00", valorNum: 197, vencimento: "10/04/2026", status: "approved", criado: "01/04/2026", pago_em: "08/04/2026", txid: "pix_com_abr2026" },
  { id: 3, empresa: "Import Export SA", competencia: "Abr/2026", valor: "R$ 497,00", valorNum: 497, vencimento: "10/04/2026", status: "approved", criado: "01/04/2026", pago_em: "05/04/2026", txid: "pix_imp_abr2026" },
  { id: 4, empresa: "Restaurante Sabor", competencia: "Mar/2026", valor: "R$ 147,00", valorNum: 147, vencimento: "10/03/2026", status: "approved", criado: "01/03/2026", pago_em: "09/03/2026", txid: "pix_rest_mar2026" },
  { id: 5, empresa: "Loja Virtual Pro", competencia: "Mar/2026", valor: "R$ 297,00", valorNum: 297, vencimento: "10/03/2026", status: "overdue", criado: "01/03/2026", txid: "pix_loja_mar2026" },
];

const statusMap: Record<string, { label: string; className: string }> = {
  approved: { label: "Pago", className: "bg-accent/10 text-accent" },
  pending: { label: "Pendente", className: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]" },
  overdue: { label: "Vencido", className: "bg-destructive/10 text-destructive" },
};

const PixPage = () => {
  const { user } = useAuth();
  const [cobrancas, setCobrancas] = useState(initialCobrancas);
  const [novaOpen, setNovaOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState<any>(null);
  const [form, setForm] = useState({ empresa: "", competencia: "", valor: "", vencimento: "" });

  const totalPagas = cobrancas.filter((c) => c.status === "approved").length;
  const totalPendentes = cobrancas.filter((c) => c.status === "pending").length;
  const totalVencidas = cobrancas.filter((c) => c.status === "overdue").length;
  const receitaTotal = cobrancas.filter((c) => c.status === "approved").reduce((s, c) => s + c.valorNum, 0);

  const handleNova = () => {
    if (!form.empresa.trim() || !form.valor.trim()) { toast.error("Preencha empresa e valor."); return; }
    const nova = {
      id: Date.now(),
      empresa: form.empresa,
      competencia: form.competencia || "Abr/2026",
      valor: `R$ ${form.valor}`,
      valorNum: parseFloat(form.valor.replace(",", ".")),
      vencimento: form.vencimento || "10/04/2026",
      status: "pending",
      criado: new Date().toLocaleDateString("pt-BR"),
      txid: `pix_${Date.now()}`,
    };
    setCobrancas((prev) => [nova, ...prev]);
    toast.success("Cobrança PIX gerada com sucesso!");
    setNovaOpen(false);
    setForm({ empresa: "", competencia: "", valor: "", vencimento: "" });
  };

  const handleMarcarPago = (id: number) => {
    setCobrancas((prev) => prev.map((c) => c.id === id ? { ...c, status: "approved", pago_em: new Date().toLocaleDateString("pt-BR") } : c));
    toast.success("Pagamento confirmado!");
    setQrOpen(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cobrança PIX</h1>
          <p className="text-muted-foreground">
            {user?.role === "contador" ? "Cobranças PIX para suas empresas" : "Gerencie cobranças PIX"}
          </p>
        </div>
        <Button variant="hero" onClick={() => setNovaOpen(true)}><Plus size={16} className="mr-2" />Nova Cobrança</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total de cobranças" value={cobrancas.length} icon={CreditCard} color="primary" />
        <StatCard title="Pagas" value={totalPagas} icon={CheckCircle} color="accent" />
        <StatCard title="Pendentes" value={totalPendentes} icon={Clock} color="warning" />
        <StatCard title="Receita total" value={receitaTotal} prefix="R$ " icon={DollarSign} color="primary" />
      </div>

      <DataTable
        columns={[
          { key: "empresa", header: "Empresa" },
          { key: "competencia", header: "Competência" },
          { key: "valor", header: "Valor" },
          { key: "vencimento", header: "Vencimento" },
          { key: "status", header: "Status", render: (r: any) => { const s = statusMap[r.status] || statusMap.pending; return <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>; } },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDetailOpen(r)} title="Detalhes"><Eye size={14} /></Button>
              {r.status === "pending" && (
                <Button variant="outline" size="sm" onClick={() => setQrOpen(r)}><QrCode size={14} className="mr-1" />QR Code</Button>
              )}
              {r.status === "overdue" && (
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => setQrOpen(r)}><AlertCircle size={14} className="mr-1" />Reenviar</Button>
              )}
              {r.status === "approved" && <span className="text-xs text-muted-foreground px-2">Pago em {r.pago_em}</span>}
            </div>
          )},
        ]}
        data={cobrancas}
      />

      {/* Modal Nova Cobrança */}
      <Dialog open={novaOpen} onOpenChange={setNovaOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Cobrança PIX</DialogTitle>
            <DialogDescription>Gere uma cobrança PIX para a empresa.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="sm:col-span-2 space-y-2">
              <Label>Empresa</Label>
              <select value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="">Selecione...</option>
                <option>Tech Solutions LTDA</option><option>Comércio Digital ME</option><option>Import Export SA</option><option>Restaurante Sabor</option><option>Loja Virtual Pro</option><option>Padaria Central</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Competência</Label><Input value={form.competencia} onChange={(e) => setForm({ ...form, competencia: e.target.value })} placeholder="Abr/2026" /></div>
            <div className="space-y-2"><Label>Valor (R$)</Label><Input value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder="297,00" /></div>
            <div className="space-y-2"><Label>Vencimento</Label><Input type="date" value={form.vencimento} onChange={(e) => setForm({ ...form, vencimento: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setNovaOpen(false)}>Cancelar</Button>
            <Button variant="hero" onClick={handleNova}>Gerar Cobrança</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal QR Code */}
      <Dialog open={!!qrOpen} onOpenChange={() => setQrOpen(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code PIX</DialogTitle>
            <DialogDescription>Compartilhe este QR Code com a empresa para pagamento.</DialogDescription>
          </DialogHeader>
          {qrOpen && (
            <div className="text-center space-y-4 pt-4">
              <div className="mx-auto w-48 h-48 bg-foreground rounded-xl flex items-center justify-center">
                <div className="w-40 h-40 bg-background rounded-lg p-2">
                  <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${(i + Math.floor(i / 8)) % 3 === 0 ? "bg-foreground" : "bg-background"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground">{qrOpen.empresa}</p>
                <p className="text-sm text-muted-foreground">{qrOpen.competencia} — {qrOpen.valor}</p>
                <p className="text-xs text-muted-foreground mt-1">Vencimento: {qrOpen.vencimento}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Copia e Cola PIX</p>
                <p className="text-xs font-mono text-foreground break-all select-all">00020126580014br.gov.bcb.pix0136{qrOpen.txid}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { navigator.clipboard.writeText(`00020126580014br.gov.bcb.pix0136${qrOpen.txid}`); toast.success("Código PIX copiado!"); }}>Copiar código</Button>
                <Button variant="hero" className="flex-1" onClick={() => handleMarcarPago(qrOpen.id)}>Confirmar Pgto</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes */}
      <Dialog open={!!detailOpen} onOpenChange={() => setDetailOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Cobrança</DialogTitle>
            <DialogDescription>Informações completas da cobrança PIX.</DialogDescription>
          </DialogHeader>
          {detailOpen && (
            <div className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Empresa</p><p className="font-medium text-foreground">{detailOpen.empresa}</p></div>
                <div><p className="text-xs text-muted-foreground">Competência</p><p className="font-medium text-foreground">{detailOpen.competencia}</p></div>
                <div><p className="text-xs text-muted-foreground">Valor</p><p className="font-bold text-foreground">{detailOpen.valor}</p></div>
                <div><p className="text-xs text-muted-foreground">Vencimento</p><p className="font-medium text-foreground">{detailOpen.vencimento}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><p className={`font-medium ${detailOpen.status === "approved" ? "text-accent" : detailOpen.status === "overdue" ? "text-destructive" : "text-[hsl(45,93%,47%)]"}`}>{statusMap[detailOpen.status]?.label}</p></div>
                <div><p className="text-xs text-muted-foreground">Criado em</p><p className="font-medium text-foreground">{detailOpen.criado}</p></div>
                {detailOpen.pago_em && <div><p className="text-xs text-muted-foreground">Pago em</p><p className="font-medium text-accent">{detailOpen.pago_em}</p></div>}
                <div><p className="text-xs text-muted-foreground">TXID</p><p className="font-mono text-xs text-foreground">{detailOpen.txid}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PixPage;
