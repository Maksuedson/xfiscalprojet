import { useState } from "react";
import { DollarSign, CheckCircle, Clock, AlertTriangle, Plus, Eye, Filter, QrCode, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { usePaymentGateway } from "@/contexts/PaymentGatewayContext";
import { usePlatformCharges, useCreatePlatformCharge, useUpdatePlatformCharge, useAccountants } from "@/hooks/useSupabaseData";

const CobrancasPlataformaPage = () => {
  const { isConfigured, config, generatePixPayment } = usePaymentGateway();
  const { data: charges, isLoading } = usePlatformCharges();
  const { data: accountants } = useAccountants();
  const createCharge = useCreatePlatformCharge();
  const updateCharge = useUpdatePlatformCharge();

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [showNova, setShowNova] = useState(false);
  const [showDetalhe, setShowDetalhe] = useState<any>(null);
  const [showPix, setShowPix] = useState<any>(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ accountant_id: "", competencia: "", valor: "", vencimento: "" });

  const items = (charges || []).map((c: any) => ({ ...c, contador: c.accountants?.nome || "-", plano: c.accountants?.plano || "-" }));
  const filtered = filtroStatus === "todos" ? items : items.filter((c: any) => c.status === filtroStatus);
  const totalPago = items.filter((c: any) => c.status === "pago").reduce((s: number, c: any) => s + Number(c.valor), 0);
  const totalPendente = items.filter((c: any) => c.status === "pendente").reduce((s: number, c: any) => s + Number(c.valor), 0);
  const totalVencido = items.filter((c: any) => c.status === "vencido").reduce((s: number, c: any) => s + Number(c.valor), 0);

  const handleCriar = async () => {
    if (!form.accountant_id || !form.competencia || !form.valor || !form.vencimento) {
      toast({ title: "Preencha todos os campos", variant: "destructive" }); return;
    }
    try {
      await createCharge.mutateAsync({
        accountant_id: form.accountant_id,
        competencia: form.competencia,
        valor: parseFloat(form.valor),
        vencimento: form.vencimento,
      });
      toast({ title: "Cobrança gerada com sucesso!" });
      setShowNova(false);
      setForm({ accountant_id: "", competencia: "", valor: "", vencimento: "" });
    } catch (err: any) { toast({ title: "Erro", description: err.message, variant: "destructive" }); }
  };

  const handleMarcarPago = async (id: string) => {
    await updateCharge.mutateAsync({ id, status: "pago", pago_em: new Date().toISOString(), forma_pagamento: "pix" });
    toast({ title: "Cobrança marcada como paga" });
    setShowDetalhe(null);
  };

  const handleGerarPix = async (cobranca: any) => {
    if (!isConfigured) { toast({ title: "Gateway não configurado", variant: "destructive" }); return; }
    setShowPix(cobranca); setPixLoading(true); setPixData(null);
    const result = await generatePixPayment({ valor: Number(cobranca.valor), descricao: `Mensalidade xFiscal - ${cobranca.competencia}`, pagadorNome: cobranca.contador, pagadorCpfCnpj: "00.000.000/0001-00" });
    setPixLoading(false);
    if (result.success) setPixData(result);
    else { toast({ title: "Erro", description: result.error, variant: "destructive" }); setShowPix(null); }
  };

  const statusColors: Record<string, string> = {
    pago: "bg-accent/10 text-accent", pendente: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
    vencido: "bg-destructive/10 text-destructive", cancelado: "bg-muted text-muted-foreground",
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Cobranças da Plataforma</h1><p className="text-muted-foreground">Gestão de mensalidades Admin → Contadores</p></div>
        <Button onClick={() => setShowNova(true)}><Plus size={16} className="mr-2" /> Nova Cobrança</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Recebido" value={totalPago} prefix="R$ " icon={CheckCircle} color="accent" />
        <StatCard title="Pendente" value={totalPendente} prefix="R$ " icon={Clock} color="warning" />
        <StatCard title="Vencido" value={totalVencido} prefix="R$ " icon={AlertTriangle} color="destructive" />
        <StatCard title="Total Cobranças" value={items.length} icon={DollarSign} color="primary" />
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
          { key: "valor", header: "Valor", render: (r: any) => `R$ ${Number(r.valor).toFixed(2).replace(".", ",")}` },
          { key: "vencimento", header: "Vencimento", render: (r: any) => new Date(r.vencimento).toLocaleDateString("pt-BR") },
          { key: "status", header: "Status", render: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span> },
          { key: "acoes", header: "Ações", render: (r: any) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowDetalhe(r)}><Eye size={14} /></Button>
              {(r.status === "pendente" || r.status === "vencido") && <Button variant="ghost" size="sm" onClick={() => handleGerarPix(r)}><QrCode size={14} /></Button>}
            </div>
          )},
        ]}
        data={filtered}
      />

      {/* Nova cobrança */}
      <Dialog open={showNova} onOpenChange={setShowNova}>
        <DialogContent>
          <DialogHeader><DialogTitle>Gerar Nova Cobrança</DialogTitle><DialogDescription>Cobrança de mensalidade para contador</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Contador</Label>
              <Select value={form.accountant_id} onValueChange={v => {
                const acc = (accountants || []).find((a: any) => a.id === v);
                const prices: Record<string, string> = { Starter: "97", Pro: "197", Enterprise: "397" };
                setForm({ ...form, accountant_id: v, valor: acc ? prices[acc.plano] || "97" : "" });
              }}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {(accountants || []).map((a: any) => <SelectItem key={a.id} value={a.id}>{a.nome} ({a.plano})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Competência</Label><Input value={form.competencia} onChange={e => setForm({...form, competencia: e.target.value})} placeholder="Mai/2026" /></div>
            <div><Label>Valor (R$)</Label><Input value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} /></div>
            <div><Label>Vencimento</Label><Input type="date" value={form.vencimento} onChange={e => setForm({...form, vencimento: e.target.value})} /></div>
          </div>
          <DialogFooter><Button onClick={handleCriar} disabled={createCharge.isPending}>{createCharge.isPending ? "Gerando..." : "Gerar Cobrança"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detalhe */}
      <Dialog open={!!showDetalhe} onOpenChange={() => setShowDetalhe(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhe da Cobrança</DialogTitle><DialogDescription>Informações da cobrança</DialogDescription></DialogHeader>
          {showDetalhe && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Contador:</span><p className="font-medium">{showDetalhe.contador}</p></div>
              <div><span className="text-muted-foreground">Competência:</span><p className="font-medium">{showDetalhe.competencia}</p></div>
              <div><span className="text-muted-foreground">Valor:</span><p className="font-medium">R$ {Number(showDetalhe.valor).toFixed(2).replace(".",",")}</p></div>
              <div><span className="text-muted-foreground">Status:</span><p><span className={`px-2 py-1 rounded-full text-xs ${statusColors[showDetalhe.status]}`}>{showDetalhe.status}</span></p></div>
            </div>
          )}
          <DialogFooter>
            {(showDetalhe?.status === "pendente" || showDetalhe?.status === "vencido") && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setShowDetalhe(null); handleGerarPix(showDetalhe); }}><QrCode size={14} className="mr-2" />Gerar PIX</Button>
                <Button onClick={() => handleMarcarPago(showDetalhe.id)}>Marcar como Pago</Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PIX */}
      <Dialog open={!!showPix} onOpenChange={() => { setShowPix(null); setPixData(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cobrança PIX</DialogTitle><DialogDescription>{showPix?.contador} — R$ {showPix ? Number(showPix.valor).toFixed(2).replace(".",",") : ""}</DialogDescription></DialogHeader>
          {pixLoading ? (
            <div className="py-12 text-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" /><p className="text-sm text-muted-foreground">Gerando PIX...</p></div>
          ) : pixData ? (
            <div className="text-center space-y-4">
              <img src={pixData.qrCode} alt="QR Code PIX" className="w-48 h-48 mx-auto rounded-lg border border-border" />
              <div className="flex gap-2"><Input readOnly value={pixData.pixCopiaECola} className="text-xs font-mono" /><Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(pixData.pixCopiaECola); setCopied(true); setTimeout(() => setCopied(false), 3000); }}>{copied ? <Check size={14} /> : <Copy size={14} />}</Button></div>
            </div>
          ) : null}
          <DialogFooter>
            {pixData && <Button onClick={() => { handleMarcarPago(showPix.id); setShowPix(null); setPixData(null); }}>Confirmar Pagamento</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CobrancasPlataformaPage;
